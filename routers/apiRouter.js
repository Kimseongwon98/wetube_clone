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

const apiRouter = express.Router();

apiRouter.post(routes.registerView, registerView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.delComment, postDelComment);
apiRouter.post(routes.subscribe, subscribeProfile);
apiRouter.post(routes.unsubscribe, unsubscribeProfile);
apiRouter.post(routes.like, likeVideo);
apiRouter.post(routes.cancelLike, cancelLike);

export default apiRouter;
