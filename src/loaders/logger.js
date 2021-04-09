import path from 'path';
import winston from 'winston';
import config from '../config';

const transports = [
  //
  // - Write to all logs with level `info` and below to `combined.log`
  // - Write all logs error (and below) to `error.log`.
  //
  new winston.transports.File({
    filename: path.resolve(__dirname, '../../logs/error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.resolve(__dirname, '../../logs/combined.log'),
  }),
];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    }),
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

LoggerInstance.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be
    // picked up by both transports (file and console)
    LoggerInstance.info(message);
  },
};

export default LoggerInstance;
