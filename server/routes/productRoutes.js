import { Router } from 'express';
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
const router = Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
