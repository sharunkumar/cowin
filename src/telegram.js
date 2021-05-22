const bot = require('node-telegram-bot-api')
const Configuration = require('./configuration')

class Telegram {
    constructor() {
        this.config = new Configuration()
        this.bot = new bot(this.config.readConfig().telegram_bot_token)
        this.sendText = (text) => {
            try {
                this.bot.sendMessage(this.config.readConfig().telegram_group_id, text, {
                    "parse_mode": "Markdown"
                    , "disable_web_page_preview": true
                })
            } catch (err) {
                console.error('Telegram: error while sending text')
                console.error(err)
            }
            
        } 
    }
}

module.exports = new Telegram()