import { Router } from 'express';
const router = Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(protect, admin, getUsers).post(registerUser);
router.post('/logout', logoutUser);
router.post('/auth', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, checkObjectId, deleteUser)
  .get(protect, admin, checkObjectId, getUserById)
  .put(protect, admin, checkObjectId, updateUser);

export default router;
