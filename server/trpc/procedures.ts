import { t } from './index';
import { isAuthed } from './middlewares';

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);
