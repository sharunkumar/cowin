const bot = require('node-telegram-bot-api')
const Configuration = require('./configuration')

class Telegram {
    constructor() {
        this.config = new Configuration()
        this.bot = new bot(this.config.readConfig().telegram_bot_token)
        this.logger = require('./logger')
        this.sendText = (text, override_group=undefined) => {
            this.bot.sendMessage(override_group || this.config.readConfig().telegram_group_id, text, {
                "parse_mode": "Markdown"
                , "disable_web_page_preview": true
            }).then(message => {
                this.logger.info(`telegram: sent\n${message.text}`)
            }).catch(error => {
                this.logger.error(`telegram: ${error}`)
            })
        } 
    }
}

module.exports = new Telegram()