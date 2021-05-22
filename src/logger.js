const date = require("date-and-time")
const { exec } = require("child_process")

const date_format = "YYYY MMM DD hh:mm:ss:SSS A"
const getdate = () => date.format(new Date(), date_format)

class AndroidLogger {
    constructor (tag='node') {
        this.supported = false
        this.tag = tag
        if (process.platform == 'android') {
            this.supported = true
        } else {
            console.warn(getdate(), "AndroidLogger does not support", process.platform)
        }
        this.info = message => { if (this.supported) { exec(`/system/bin/log -p i -t ${this.tag} '${message}'`) } }
        this.warn = message => { if (this.supported) { exec(`/system/bin/log -p w -t ${this.tag} '${message}'`) } }
        this.debug = message => { if (this.supported) { exec(`/system/bin/log -p d -t ${this.tag} '${message}'`) } }
    }
}

class Logger {
    constructor() {
        if (process.platform == 'android') {
            this.android = new AndroidLogger()
        } else {
            this.android = undefined
        }
        this.info = object => { console.info(getdate(), object), this.android?.info(object) }
        this.warn = object => { console.warn(getdate(), object), this.android?.warn(object) }
        this.debug = object => { console.debug(getdate(), object), this.android?.debug(object) }
    }
}

module.exports = new Logger()