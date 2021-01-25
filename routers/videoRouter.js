import express from "express";
import {
  deleteVideo,
  editVideo,
  upload,
  videoDetail,
  videos,
} from "../Controllers/videoController.js";
import routes from "../routes.js";

const videoRouter = express.Router();

videoRouter.get(routes.home, videos);
videoRouter.get(routes.upload, upload);
videoRouter.get(routes.videoDetail, videoDetail);
videoRouter.get(routes.editVideo, editVideo);
videoRouter.get(routes.deleteVideo, deleteVideo);
export default videoRouter;
