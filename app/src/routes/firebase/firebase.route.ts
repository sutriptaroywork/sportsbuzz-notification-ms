import Routes from "@/src/routes";
import { Router } from "express";

import FirebaseController from "@controllers/firebase/firebase.controller";

export default class FirebaseRoutes implements Routes {
  public path: string;
  public router: Router;
  private firebaseController: FirebaseController;

  constructor() {
    this.path = "/firebase";
    this.router = Router();
    
    this.firebaseController = new FirebaseController();
    this.initialiseRoutes();
  }
  initialiseRoutes = () => {
    // firebase short url api
    this.router.post(`${this.path}/short-url/v1`, this.firebaseController.createFirebaseShortUrl);
  }
}
