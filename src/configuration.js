class Configuration {
    constructor(filename) {
        this.filename = filename
        this.fs = require("fs")
        this.blacklist = []
        this.telegram_bot_token = ''
        this.telegram_group_id = ''
        this.districts = []
        this.readConfig = () => {
            // for refreshing the config when needed
            try {
                const data = JSON.parse(this.fs.readFileSync(this.filename, 'utf-8'))
                this.blacklist = data['blacklist']
                this.telegram_bot_token = data['telegram_bot_token']
                this.telegram_group_id = data['telegram_group_id']
                this.districts = data['districts']
            } catch(err) {
                console.warn('error while readng config', err)
            }
            return this
        }
        this.readConfig()
    }
}

module.exports = Configuration