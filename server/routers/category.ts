import {
  createCategory,
  getCategoriesByBusinessId,
} from '../controllers/category';
import { t } from '../trpc';

export const categoryRoutes = t.router({
  getCategoriesByBusinessId,
  createCategory,
});
