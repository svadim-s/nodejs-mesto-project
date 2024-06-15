import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import BadRequestError from '../Errors/BadRequestError';
import NotFoundError from '../Errors/NotFoundError';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: res.locals.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }

      return next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove({ _id: cardId, owner: res.locals.user?._id })
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then(() => res.send({ message: 'Card deleted' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id карточки'));
      }

      return next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.user._id;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id карточки'));
      }

      return next(err);
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: res.locals.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный id карточки'));
      }

      return next(err);
    });
};
