import express from "express";
import {
  changePassword,
  editProfile,
  userDetail,
} from "../Controllers/userController.js";
import { onlyPrivate } from "../middlewares.js";
import routes from "../routes.js";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;

/* M data
   V how dose tje data look
   C function that looks for the data */
