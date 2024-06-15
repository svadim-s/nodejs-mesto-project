import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BadRequestError from '../Errors/BadRequestError';
import User from '../models/user';
import NotFoundError from '../Errors/NotFoundError';
import UnauthorizedError from '../Errors/UnauthorizedError';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

const getUserData = (
  userId: string,
  _req:Request,
  res:Response,
  next: NextFunction,
) => User.findById(userId)
  .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id пользователя'));
    }

    return next(err);
  });

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.user._id;
  const user = await getUserData(userId, req, res, next);
  return user;
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const user = await getUserData(userId, req, res, next);
  return user;
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  return User.create({
    name,
    about,
    avatar,
    email,
    password: hashPassword,
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }

      return next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findOneAndUpdate(
    req.body.user?._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id пользователя'));
      }
      return next(err);
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return User.findOneAndUpdate(
    req.body.user?._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id пользователя'));
      }
      return next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            secure: true,
          });

          return res.send({ token });
        });
    })
    .catch(next);
};
