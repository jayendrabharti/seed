import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  getProductCount,
} from '../controllers/inventory';
import { t } from '../trpc';

export const inventoryRoutes = t.router({
  addProduct,
  getProductCount,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
});
