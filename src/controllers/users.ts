import { Request, Response } from 'express';
import User from '../models/user';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR } from './utils/ErrorTypes';

export const getUsers = async (req: Request, res: Response) => {
  return await User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const getUserById = async (req: Request, res: Response) => {
  return await User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден'});
      }

      res.send({ data: user });
    })
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }

  return await User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, about } = req.body;

  return await User.findByIdAndUpdate(
    req.body.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден'});
      }

      res.send(user);
    })
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }

  return await User.findByIdAndUpdate(
    req.body.user?._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден'});
      }

      res.send(user);
    })
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};
