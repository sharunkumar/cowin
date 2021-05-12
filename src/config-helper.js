const fs = require('fs')
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })

// apologies in advance for callback hell, wanted to do this natively
readline.question("enter telegram bot token: ", bot_token => {
    readline.question("enter telegram group/channel id: ", group_id => {
        let configuration = {
            "blacklist": [],
            "telegram_bot_token": bot_token,
            "telegram_group_id": group_id
        }

        console.log(configuration)

        fs.writeFileSync('config.json', JSON.stringify(configuration, null, 4))

        readline.close()
    })
})