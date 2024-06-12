import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { ERROR_CODE_BAD_REQUEST } from './controllers/utils/ErrorTypes';

const MONGODB_URI = 'mongodb://localhost:27017/mestodb';

const app = express();
const PORT = 3000;

app.use(helmet());

mongoose.connect(MONGODB_URI);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: '66681d1427311eefb813ed4e',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res, next) => {
  next(res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Запрашиваемый ресурс не найден' }));
});

app.listen(PORT);
