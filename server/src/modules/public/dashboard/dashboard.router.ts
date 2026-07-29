import { Router } from "express";

import  authUser  from "../../../shared/middlewares/auth.middleware.js";
import { getDashboard } from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get(
    "/",
    authUser,
    getDashboard,
);

export default dashboardRouter;