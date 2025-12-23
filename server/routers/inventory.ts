import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
} from '../controllers/inventory';
import { t } from '../trpc';

export const inventoryRoutes = t.router({
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
});
