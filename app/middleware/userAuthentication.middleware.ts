import { Response, Request, NextFunction } from 'express';
import { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import Sentry from '@sentry/node';
import { validationResult } from 'express-validator';

import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import { HttpException } from '@/library/HttpException/HttpException';
import RedisDao from '@daos/baseRedisDao';

export default class UserAuthenticationMiddleware {
  private redisDao: RedisDao;

  constructor() {
    this.redisDao = new RedisDao();
  }

  isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')
      const lang = req.header('Language')
      if (lang === 'English') {
        req.userLanguage = 'English'
      }
      req.userLanguage = 'English'
      if (!token) {
        throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
      }
  
      const isBlackList = await this.redisDao.getBlackListToken(`BlackListToken:${token}`);
      if (isBlackList) {
        throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
      }

      let user: any;
      try {
        // user = await UsersModel.findByToken(token)
        user = jwt.verify(token, process.env.JWT_SECRET)
      } catch (err) {
        throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
      }
  
      if (!user) {
        throw new HttpException(StatusCodeEnums.UNAUTHORIZED, MessagesEnglish.err_unauthorized);
      }
      else if(!user._id) {
        throw new HttpException(StatusCodeEnums.INTERNAL_SERVER_ERROR, MessagesEnglish.error);
      }
  
      if (user.eType === 'B') {
        throw new HttpException(StatusCodeEnums.NOT_FOUND, MessagesEnglish.user_blocked);
      }
      // await redisClient.hset(`at:${token}`, '_id', user._id.toString())
      // await redisClient.expire(`at:${token}`, 86400)
      req.user = user;
      req.user._id = new Schema.Types.ObjectId(user._id);

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(StatusCodeEnums.UNPROCESSABLEENTITY).jsonp({
          status: StatusCodeEnums.UNPROCESSABLEENTITY,
          errors: errors.array()
        });
      }
      return next(null);
    } catch (error) {
      // if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
      next(error);
    }
  }
}