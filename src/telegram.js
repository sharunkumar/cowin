const bot = require('node-telegram-bot-api')
const Configuration = require('./configuration')

class Telegram {
    constructor() {
        this.config = new Configuration()
        this.bot = new bot(this.config.readConfig().telegram_bot_token)
        this.logger = require('./logger')
        this.sendText = async (text, override_group=undefined) => {

            // telegram message has size limits of 4096 bytes
            // https://stackoverflow.com/a/66297304/1083566

            const max_size = 4096
            var messageString = text

            var amount_sliced = messageString.length / max_size
            var start = 0
            var end = max_size
            var message
            var messagesArray = []
            for (let i = 0; i < amount_sliced; i++) {
                message = messageString.slice(start, end)
                messagesArray.push(message)
                start = start + max_size
                end = end + max_size
            }

            for (const msg of messagesArray) {
                await this.bot.sendMessage(override_group || this.config.readConfig().telegram_group_id, msg, {
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
}

module.exports = new Telegram()