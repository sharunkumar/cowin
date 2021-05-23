const YAML = require('yaml')

class Configuration {
    constructor() {
        this.filename = 'config.yml'
        this.fs = require("fs")
        this.blacklist = []
        this.telegram_bot_token = ''
        this.telegram_group_id = ''
        this.districts = []
        this.district_age = {}
        this.district_group = {}
        this.readConfig = () => {
            // for refreshing the config when needed
            try {
                const data = YAML.parse(this.fs.readFileSync(this.filename, 'utf-8'))
                this.blacklist = data['blacklist']
                this.telegram_bot_token = data['telegram_bot_token']
                this.telegram_group_id = data['telegram_group_id']
                this.districts = data['districts']
                this.district_age = data['district_age']
                this.district_group = data['district_group']
            } catch(err) {
                console.error('error while reading config', err)
            }
            return this
        }
        this.readConfig()
    }
}

module.exports = Configuration