const bot = require('node-telegram-bot-api')
const Configuration = require('./configuration')

class Telegram {
    constructor() {
        this.config = new Configuration('config.json')
        this.bot = new bot(this.config.readConfig().telegram_bot_token, { polling: true })
        this.sendText = (text) => {
            try {
                this.bot.sendMessage(this.config.readConfig().telegram_group_id, text, {
                    "parse_mode": "Markdown"
                    , "disable_web_page_preview": true
                })
            } catch (err) {
                console.warn('error while sendText', err)
            }
            
        } 
        this.bot.on("new_chat_members", async (message, metadata) => {
            if ((await this.bot.getMe()).id == message['new_chat_participant']['id']) {
                this.bot.sendMessage(message.chat.id, `The chat id is \`${message.chat.id}\``, {
                    "parse_mode": "Markdown"
                })
            }
        })
    }
}

module.exports = new Telegram() 
