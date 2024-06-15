import { createLogger, format, transports } from 'winston';

export const requestLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'request.log' }),
  ],
});

export const errorLogger = createLogger({
  level: 'error',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'error.log' }),
  ],
});
