import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import { validateUserAvatar, validateUserInfo } from '../middlewares/validators/userValidator';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', validateUserInfo, updateUser);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

export default router;
