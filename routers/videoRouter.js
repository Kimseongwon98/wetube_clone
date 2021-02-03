import express from "express";
import {
  deleteVideo,
  getEditVideo,
  getUpload,
  postEditVideo,
  postUpload,
  videoDetail,
  videos,
} from "../Controllers/videoController.js";
import { uploadVideo } from "../middlewares.js";
import routes from "../routes.js";

const videoRouter = express.Router();

videoRouter.get(routes.home, videos);

videoRouter.get(routes.upload, getUpload);
videoRouter.post(routes.upload, uploadVideo, postUpload);

videoRouter.get(routes.videoDetail(), videoDetail);

videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(), postEditVideo);

videoRouter.get(routes.deleteVideo, deleteVideo);
export default videoRouter;
