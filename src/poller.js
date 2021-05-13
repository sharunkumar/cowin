const axios = require("axios");
const Configuration = require('./configuration')
const telegram = require('./telegram')
const date = require("date-and-time")
const logger = require('./logger')

let sent_sessions = [] // for preventing processing of the same session again

const config = new Configuration('config.json')

const poll = () => {
	logger.info("polling")
	
	const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=303&date=${date.format(new Date(), 'DD-MM-YYYY')}`
	
	axios.defaults.headers.common['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
	axios.defaults.headers.common['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
	
	let blacklist = []
	
	blacklist = config.readConfig().blacklist
	
	axios.get(url).then(res => {
		centers = res.data.centers.filter(c => !blacklist.includes(c.name) & c.sessions.some(sesh => sesh.available_capacity > 0))
		
		if (centers.length > 0) {
			let text = ''

			centers.forEach(c => {

				let innerText = ''
				c.sessions = c.sessions.filter(s => s.available_capacity > 0 & !sent_sessions.includes(s.session_id))

				if (c.sessions.length > 0) {
					c.sessions.forEach(s => {
						sent_sessions.push(s.session_id)
						setTimeout(() => {
							// remove the id from sent sessions after 1 min
							sent_sessions = sent_sessions.filter(sent => sent.session_id !== s.session_id)
						}, 1 * 60 * 1000);
						innerText = innerText +
							`- date: ${s.date}\n` +
							`- available: ${s.available_capacity}\n` +
							`- age: ${s.min_age_limit}+\n` +
							`- vaccine: ${s.vaccine}\n`
					})
				}
				
				innerText = innerText.trim()

				if (innerText !== '') {
					text = text +
							`${c.name} \`${c.pincode}\` [directions](https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.name)})\n` +
							`${innerText}\n`
				}
			})

			text = text.trim()

			if (text !== '') {
				text += "\nhttps://selfregistration.cowin.gov.in"
				telegram.sendText(text)
				logger.info(`sent to telegram\n${text}`)
			}
		}
	}).catch(err => {
		logger.warn("ERROR")
		logger.warn(err)
	})

};

const poller = () => {
	poll()
	setInterval(() => {
		poll()
	}, 10 * 1000);
};

module.exports = poller