import express from "express";
import {
  getChangePassword,
  getEditProfile,
  getMoreInfo,
  postChangePassword,
  postEditProfile,
  postLogin,
  postMoreInfo,
  userDetail,
} from "../Controllers/userController";
import { onlyPrivate, uploadAvatar } from "../middlewares";
import routes from "../routes";

const userRouter = express.Router();

userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);
userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);
userRouter.get(routes.getMore, onlyPrivate, getMoreInfo);
userRouter.post(routes.getMore, onlyPrivate, postMoreInfo, postLogin);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;

/* M data
   V how dose tje data look
   C function that looks for the data */
