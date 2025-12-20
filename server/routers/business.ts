import {
  createNewBusiness,
  deleteBusiness,
  getBusinessesMemberships,
  renameBusiness,
} from '../controllers/business';
import { t } from '../trpc';

export const businessRoutes = t.router({
  getBusinessesMemberships,
  createNewBusiness,
  renameBusiness,
  deleteBusiness,
});
