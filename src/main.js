const logger = require("./logger")

logger.info("program started")

require("./poll-manager").start_polling()