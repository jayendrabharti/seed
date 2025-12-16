import {
  createNewBusiness,
  deleteBusiness,
  getBusinesses,
  renameBusiness,
} from '../controllers/business';
import { t } from '../trpc';

export const businessRoutes = t.router({
  getBusinesses,
  createNewBusiness,
  renameBusiness,
  deleteBusiness,
});
