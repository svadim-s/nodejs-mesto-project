import { Request, Response } from 'express';
import User from '../models/user';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR } from './utils/ErrorTypes';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));

export const getUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .orFail(new Error('NotFound'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }

    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
    }

    return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
  });

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.body.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      }

      return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.body.user?._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }

      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
      }

      return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
    });
};
