import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

const MONGODB_URI = 'mongodb://localhost:27017/mestodb';

const app = express();
const PORT = 3000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: "66681d1427311eefb813ed4e"
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT);
