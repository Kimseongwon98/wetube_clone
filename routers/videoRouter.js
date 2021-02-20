import express from "express";
import {
  deleteVideo,
  getEditVideo,
  getRecord,
  getUpload,
  postEditVideo,
  postRecord,
  postUpload,
  videoDetail,
} from "../Controllers/videoController";
import { onlyPrivate, uploadVideo } from "../middlewares";
import routes from "../routes";

const videoRouter = express.Router();

videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

videoRouter.get(routes.record, onlyPrivate, getRecord);
videoRouter.post(routes.record, onlyPrivate, uploadVideo, postRecord);

videoRouter.get(routes.videoDetail(), videoDetail);

videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);

videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);

export default videoRouter;
