import express from "express";
import { join, login, logout } from "../Controllers/userController.js";
import { home, search } from "../Controllers/videoController.js";
import routes from "../routes.js";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.join, join);
globalRouter.get(routes.login, login);
globalRouter.get(routes.logout, logout);
globalRouter.get(routes.search, search);

export default globalRouter;
