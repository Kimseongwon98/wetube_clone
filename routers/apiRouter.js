import express from "express";
import {
  subscribeProfile,
  unsubscribeProfile,
} from "../Controllers/userController.js";
import {
  cancelLike,
  likeVideo,
  postAddComment,
  registerView,
} from "../Controllers/videoController.js";
import routes from "../routes.js";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, registerView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.subscribe, subscribeProfile);
apiRouter.post(routes.unsubscribe, unsubscribeProfile);
apiRouter.post(routes.like, likeVideo);
apiRouter.post(routes.cancelLike, cancelLike);

export default apiRouter;
