import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import helmet from "helmet";
import passport from "passport";
import cors from "cors";
import "reflect-metadata";
import { RequestParser } from "./middleware/request-parser";
import { logger, jwtStrategy } from "./helper";
import { apiRoutes } from "./routes/v1";
import { ResponseCodes, ResponseMessages } from "./helper/constants";

// Configure Express App and Routes
const app = express();
// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());

//Apply cors
app.use(cors());
// Configure body parser for POST requests
app.use(
  bodyParser.json({
    limit: "300mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "300mb",
    parameterLimit: 1000000,
  })
);
// Disable express 'powered by' headers to make server framework anonymous
app.disable("x-powered-by");
// compress all responses
app.use(compression());
// Parse request to handle OPTIONS requests, CORS
app.use(RequestParser.parseRequest);
// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// v1 api routes
app.use("/v1", apiRoutes);
// 404
app.use((req: any, res: any) => {
  res.status(ResponseCodes.DOCUMENT_NOT_FOUND).json({
    success: false,
    message: ResponseMessages.INVALID_API,
  });
});
// generic errors handling - 500.
app.use((err: any, req: any, res: any, next: any) => {
  if (!err) {
    res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ResponseMessages.CANNOT_FULFILL_REQUEST,
      detail: ResponseMessages.INTERNAL_SERVER_ERROR,
    });
  }
  logger.error(err);

  return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ResponseMessages.CANNOT_FULFILL_REQUEST,
    detail: err.message || ResponseMessages.UNEXPECTED_ERROR,
  });
});

export { app };
