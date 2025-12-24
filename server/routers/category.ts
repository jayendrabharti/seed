import {
  createCategory,
  deleteCategory,
  getCategoriesByBusinessId,
} from '../controllers/category';
import { t } from '../trpc';

export const categoryRoutes = t.router({
  getCategoriesByBusinessId,
  createCategory,
  deleteCategory,
});
