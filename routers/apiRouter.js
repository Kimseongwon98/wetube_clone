import express from "express";
import {
  subscribeProfile,
  unsubscribeProfile,
} from "../Controllers/userController";
import {
  cancelLike,
  likeVideo,
  postAddComment,
  postDelComment,
  registerView,
} from "../Controllers/videoController";
import routes from "../routes";
import { onlyPrivate } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, registerView);
apiRouter.post(routes.addComment, onlyPrivate, postAddComment);
apiRouter.post(routes.delComment, onlyPrivate, postDelComment);
apiRouter.post(routes.subscribe, onlyPrivate, subscribeProfile);
apiRouter.post(routes.unsubscribe, onlyPrivate, unsubscribeProfile);
apiRouter.post(routes.like, onlyPrivate, likeVideo);
apiRouter.post(routes.cancelLike, onlyPrivate, cancelLike);

export default apiRouter;
