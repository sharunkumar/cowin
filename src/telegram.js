const Configuration = require('./configuration')
const bot = require('node-telegram-bot-api')

class Telegram {
    constructor() {
        this.config = new Configuration('config.json')
        this.bot = new bot(this.config.readConfig().telegram_bot_token)
        this.sendText = async (text) => {
            try {
                await this.bot.sendMessage(this.config.readConfig().telegram_group_id, text, {
                    "parse_mode": "Markdown"
                    , "disable_web_page_preview": true
                })
            } catch (err) {
                console.warn('error while sendText', err)
            }
            
        } 
    }
}

module.exports = new Telegram()