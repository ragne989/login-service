
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

module.exports = createLogger({
  format: combine(
    label({ label: 'Auth-Service' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
});
