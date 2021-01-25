import express from "express";
import {
  changePassword,
  editProfile,
  userDetail,
  users,
} from "../Controllers/userController.js";
import routes from "../routes.js";

const userRouter = express.Router();

userRouter.get(routes.home, users);
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);
userRouter.get(routes.userDetail, userDetail);

export default userRouter;

/* M data
   V how dose tje data look
   C function that looks for the data */
