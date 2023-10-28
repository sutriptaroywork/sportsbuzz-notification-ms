import { Response, Request, NextFunction } from 'express';
import Sentry from '@sentry/node';
import { validationResult } from 'express-validator';

import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import { AdminModelOutput } from '@/models/admin/admin.model';
import AdminDao from '@/src/daos/admin/admin.dao';
import RoleDao from '@/src/daos/role/role.dao';
import { RoleModelOutput } from '@models/role/role.model';
import { HttpException } from '@/library/HttpException/HttpException';

export default class AdminAuthenticationMiddleware {
  private adminDao: AdminDao;
  private roleDao: RoleDao;

  constructor() {
    this.adminDao = new AdminDao();
    this.roleDao = new RoleDao();
  }
  
  validateAdmin = (sKey: string, eType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token: string = req.header('Authorization');
        req.userLanguage = 'English';
        if (!token) {
          throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
        }
        let admin: AdminModelOutput
        try {
          admin = await this.adminDao.findByToken(token);
        } catch (err) {
          throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
        }
        if (!admin) {
          throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
        }
  
        // setting admin data
        req.admin = admin
  
        let errors
        if (req.admin.eType === 'SUPER') {
          errors = validationResult(req)
          if (!errors.isEmpty()) {
            throw new HttpException(StatusCodeEnums.UNPROCESSABLEENTITY, errors.array());
          }
  
          return next(null)
        } else {
          if (!req.admin.iRoleId) {
            throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.access_denied);
          }
  
          const role: RoleModelOutput = await this.roleDao.findActiveRolePermission(req.admin.iRoleId);
          if (!role) {
            throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.access_denied);
          }
  
          const hasPermission = role.aPermissions.find((permission) => {
            return (
              permission.sKey === sKey &&
              (permission.eType === eType ||
                (eType === 'R' && permission.eType === 'W'))
            )
          })
  
          if (!hasPermission) {
            let hasSubAdminPermission
            if (sKey === 'DEPOSIT' && eType === 'W') {
              hasSubAdminPermission = role.aPermissions.find((permission) => {
                return (
                  permission.sKey === 'SYSTEM_USERS' && permission.eType === 'W'
                )
              })
            }
            if (!hasSubAdminPermission) {
              let message
  
              switch (eType) {
                case 'R':
                  message = MessagesEnglish.read_access_denied.replace('##', sKey)
                  break
                case 'W':
                  message = MessagesEnglish.write_access_denied.replace('##', sKey)
                  break
                case 'N':
                  message = MessagesEnglish.access_denied
                  break
              }
  
              throw new HttpException(StatusCodeEnums.UNAUTHORIZED, message);
            }
          }
          errors = validationResult(req)
          if (!errors.isEmpty()) {
            throw new HttpException(StatusCodeEnums.UNAUTHORIZED, errors.array());
          }
  
          return next(null)
        }
      } catch (error) {
        next(error);
      }
    }
  }
}