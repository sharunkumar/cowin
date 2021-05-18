const date = require("date-and-time")

class Logger {
    constructor() {
        const date_format = "YYYY MMM DD hh:mm:ss:SSS A"
        this.info = object => console.info(date.format(new Date(), date_format), object)
        this.warn = object => console.warn(date.format(new Date(), date_format), object)
        this.debug = object => console.debug(date.format(new Date(), date_format), object)
    }
}

module.exports = new Logger()