import express from "express";
import {
  getChangePassword,
  getEditProfile,
  postChangePassword,
  postEditProfile,
  userDetail,
} from "../Controllers/userController.js";
import { onlyPrivate, uploadAvatar } from "../middlewares.js";
import routes from "../routes.js";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);
userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;

/* M data
   V how dose tje data look
   C function that looks for the data */
