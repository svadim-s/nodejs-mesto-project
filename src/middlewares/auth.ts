import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../Errors/UnauthorizedError';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key') as JwtPayload;
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  res.locals.user = payload;

  return next();
};

export default auth;
