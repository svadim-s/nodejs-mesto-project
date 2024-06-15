import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import expressWinston from 'express-winston';
import { errors } from 'celebrate';
import errorHandler from './Errors/errorHandler';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateUserCreation, validateUserLogin } from './middlewares/validators/userValidator';
import NotFoundError from './Errors/NotFoundError';

const MONGODB_URI = 'mongodb://localhost:27017/mestodb';

const app = express();
const PORT = 3000;

app.use(helmet());

mongoose.connect(MONGODB_URI);

app.use(express.json());

app.use(expressWinston.logger({
  winstonInstance: requestLogger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
}));

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.post('/signin', validateUserLogin, login);
app.post('/signup', validateUserCreation, createUser);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(expressWinston.errorLogger({
  winstonInstance: errorLogger,
}));

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
