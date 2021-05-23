const fs = require('fs')
const Promise = require('promise')
const YAML = require('yaml')
const date = require('date-and-time')
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })
const config_file = 'config.yml'

main = async () => {
    const getInput = question => new Promise((resolve, reject) => {
        readline.question(question, answer => {
            resolve(answer)
        })
    })

    try {
        const bot_token = await getInput("enter telegram bot token: ")
        const group_id = Number(await getInput("enter telegram group/channel id: "))
        const districts = (await getInput("enter district id(s) [separate with commas]: ")).split(",").map(dist => parseInt(dist.trim())).filter(d => d != NaN)

        const blacklist = []
        const district_age = {}
        const district_group = {}

        for (const district_id of districts) {
            let age_filter = await getInput(`(optional) enter age filter for district id ${district_id} (18/45): `)
            
            if (age_filter != "") {
                district_age[district_id] = Number(age_filter)
            }
        }

        const configuration = {
            "blacklist": blacklist,
            "districts": districts,
            "district_age": district_age,
            "district_group": district_group,
            "telegram_bot_token": bot_token,
            "telegram_group_id": group_id
        }

        const writeConfig = () => {
            const cfg = YAML.stringify(configuration)
            console.log(cfg)
            fs.writeFileSync(config_file, cfg)
        }

        if (fs.existsSync(config_file)) {
            const existing_config = fs.readFileSync(config_file)

            let confirmation = await getInput(`${config_file} already exists with the following configuration:\n${existing_config}\noverwrite existing config? (y/n): `)

            if (["yes", "y"].includes(confirmation.toLowerCase())) {
                fs.renameSync(config_file, config_file.replace('.yml', `${date.format(new Date(), "YYYYMMDDhhmmssSSS")}.yml`))
                writeConfig()
            }
        } else {
            writeConfig()
        }
        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}