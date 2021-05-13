const fs = require('fs')
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })
const config_file = 'config.json'

// apologies in advance for callback hell, wanted to do this natively
readline.question("enter telegram bot token: ", bot_token => {
    readline.question("enter telegram group/channel id: ", group_id => {
        let configuration = {
            "blacklist": [],
            "telegram_bot_token": bot_token,
            "telegram_group_id": group_id
        }

        const writeConfig = () => {
            console.log(configuration)
            fs.writeFileSync(config_file, JSON.stringify(configuration, null, 4))
        }
        
        if (fs.existsSync(config_file)) {
            let existing_config = fs.readFileSync(config_file)
            readline.question(`${config_file} already exists with the following configuration:\n${existing_config}\noverwrite existing config? (y/n): `, confirmation => {
                if (["yes", "y"].includes(confirmation.toLowerCase())) {
                    writeConfig()
                    readline.close()
                } else {
                    readline.close()
                }
            })
        } else {
            writeConfig()
            readline.close()
        }

    })
})