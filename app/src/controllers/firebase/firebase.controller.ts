import { Response, Request, NextFunction } from 'express';

import { StatusCodeEnums, MessagesEnglish, WordEnglish } from '@enums/commonEnum/commonEnum';
import FirebaseService from '@services/firebase/firebase.service';
import { FirebaseShortUrlRequestDto } from '@dtos/firebaseRequestDto/firebaseRequest.dto';

export default class FirebaseController {
  private firebaseService: FirebaseService;

  constructor() {
    this.firebaseService = new FirebaseService();
  }

  createFirebaseShortUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: FirebaseShortUrlRequestDto = req.body;
      const shortUrl: string = await this.firebaseService.createFirebaseShortUrl(payload);

      res.status(StatusCodeEnums.OK).json({
        status: StatusCodeEnums.OK,
        data: shortUrl
      });
    } catch (error) {
      console.log('Error in getting Firebase short url', error)
      next(error);
    }
  };
}
