import express, { Request, Response } from "express"
import morgan  from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import NotificationRoutes from '@/src/routes/notification/notification.route';
import FirebaseRoutes from "@/src/routes/firebase/firebase.route";
import errorMiddleware from "@/middleware/error.middleware"

// initialising all connections
import connections from './connections';
import { StatusCodeEnums } from "./enums/commonEnum/commonEnum";
connections;

dotenv.config()
// console.log(process.env);

// INTIALIZE APP
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.use(morgan("dev"))

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corsOptions));

app.get("/addServiceNameBaseURL", (req: Request, res : Response) : void => {
  res.json({message : `Welcome to Sportsbuzz11 with ${process.env.NODE_ENV} enviroment`})
})
app.get('/health-check', (req, res) => {
  const sDate = new Date().toJSON();
  return res.status(StatusCodeEnums.OK).jsonp({ status: StatusCodeEnums.OK, sDate });
});
app.use("/api", [
  new NotificationRoutes().router,
  new FirebaseRoutes().router
])

app.use(errorMiddleware); 

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  console.log(err)
  res.statusCode = 500;
  res.end(`error: "Something went wrong: " +`);
});


module.exports = app;