import express from "express";
import { AuthRoutes } from "./auth.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export { router as apiRoutes };
