import { Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR } from './utils/ErrorTypes';

export const getCards = async (req: Request, res: Response) => {
  return await Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link, owner } = req.body;

  if (!name || !link || !owner) {
    return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
  }

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server Error' }));
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;

  return await Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }

      res.send({ message: 'Card deleted' });
    })
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const likeCard = async (req: Request, res: Response) => {
  return await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true }
  )
    .then((card) =>  {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }

      res.send(card);
    })
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};

export const dislikeCard = (req: Request, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }

      res.send(card);
    })
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Server error' }));
};