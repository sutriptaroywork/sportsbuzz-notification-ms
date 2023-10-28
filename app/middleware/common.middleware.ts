import { Response, Request, NextFunction } from 'express';

export default class CommonMiddleware {
  constructor() {
    // constructor
  }
  
  /**
   * for setting the user language
   * @param req request object
   * @param res response object
   * @param next next function
   */
  setLanguage = (req: Request, res: Response, next: NextFunction): void => {
    const lang = req.header('Language');
    if (lang === 'English') {
      req.userLanguage = 'English';
    }
    req.userLanguage = 'English';
    next();
  }
}