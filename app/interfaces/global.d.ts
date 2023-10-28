import { ObjectId } from 'mongoose';
import { AdminModelOutput } from '@/models/admin/admin.model';
declare global {
  namespace Express {
    interface Request {
      userLanguage?: string;
      admin?: AdminModelOutput;
      user?: any
    }
  }
}