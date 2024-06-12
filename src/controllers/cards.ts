import { Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR } from './utils/ErrorTypes';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));

export const createCard = (req: Request, res: Response) => {
  const { name, link, owner } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }

      return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .orFail(new Error('NotFound'))
    .then(() => res.send({ message: 'Card deleted' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id карточки' });
      }

      return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
    });
};

export const likeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.body.user._id } },
  { new: true },
)
  .orFail(new Error('NotFound'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }

    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id карточки' });
    }

    return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
  });

export const dislikeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.body.user._id } },
  { new: true },
)
  .orFail(new Error('NotFound'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotFound') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    }

    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id карточки' });
    }

    return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' });
  });
