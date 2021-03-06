const axios = require("axios");
const Configuration = require('./configuration')
const telegram = require('./telegram')
const date = require("date-and-time")
const logger = require('./logger')

class PollManager {
	constructor() {
		this.config = new Configuration()
		this.sent_sessions = new (class SentSessions {
			toString() {
				return JSON.stringify(this, undefined, 2)
			}
		}) // for preventing processing of the same session again
		this.poll_interval = 2
		this.poll_multiple = () => {
			if (this.config.readConfig().districts.length > 0) {
				const delta = this.poll_interval * 1000 / this.config.districts.length

				this.config.districts.forEach((district, idx) => {
					setTimeout(() => {
						this.poll(district)
					}, idx * delta);
				})

			} else {
				logger.warn("no districts in config!")
			}
		}
		this.start_polling = () => {
			this.poll_multiple()
			setInterval(() => {
				this.poll_multiple()
			}, this.poll_interval * 1000);
		}
		this.poll = (district_id) => {
			logger.info(`polling for district_id ${district_id}`)

			const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${date.format(new Date(), 'DD-MM-YYYY')}`

			axios.defaults.headers.common['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
			axios.defaults.headers.common['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'

			axios.get(url).then(res => {
				let centers = res.data.centers.filter(c => !this.config.readConfig().blacklist.includes(c.name) & c.sessions.some(sesh => sesh.available_capacity > 0))

				if(this.config.free_districts.includes(district_id)){
					centers = centers.filter(c => c.fee_type == "Free")
				}

				if (centers.length > 0) {
					let text = ''

					centers.forEach(c => {

						let innerText = ''
						c.sessions = c.sessions.filter(s =>
							s.available_capacity > 0
							& !(s.session_id in this.sent_sessions)
							& (district_id in this.config.district_age ? this.config.district_age[district_id] == s.min_age_limit : true)
							& (district_id in this.config.district_dose ? (this.config.district_dose[district_id] == 1? s.available_capacity_dose1 > 0 : s.available_capacity_dose2 > 0) : true)
						)

						if (c.sessions.length > 0) {
							c.sessions.forEach(s => {
								this.sent_sessions[s.session_id] = s.available_capacity
								setTimeout(() => {
									// remove the id from sent sessions after 5 min
									logger.info(`deleting ${s.session_id} from sent`)
									delete this.sent_sessions[s.session_id]
									logger.info(this.sent_sessions)
								}, 5 * 60 * 1000);
								innerText = innerText +
									`--- \n` +
									`- date: ${s.date}\n` +
									`- available: ${s.available_capacity}\n` +
									`- dose 1: ${s.available_capacity_dose1}\n` +
									`- dose 2: ${s.available_capacity_dose2}\n` +
									`- age: ${s.min_age_limit}+\n` +
									`- vaccine: ${s.vaccine}\n` +
									`- fee type: ${c.fee_type}\n`
							})
							logger.info(this.sent_sessions)
						}

						innerText = innerText.trim()

						if (innerText !== '') {
							text = text +
								`${c.name} \`${c.pincode}\` [directions](https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.name.replace(/(covaxin|covishield)/gi, "").replace(/\(/g, " ").replace(/\)/g, " ").trim())})\n` +
								`${innerText}\n\n`
						}
					})

					text = text.trim()

					if (text !== '') {
						text += "\n\nhttps://selfregistration.cowin.gov.in"
						telegram.sendText(text, this.config.readConfig().district_group[district_id])
					}
				}
			}).catch(err => {
				logger.error(err.toString())
			})
		}
	}
}

module.exports = new PollManager()