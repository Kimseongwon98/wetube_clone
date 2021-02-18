import routes from "../routes.js";
import Video from "../models/Video.js";
import User from "../models/User";
import Comment from "../models/Comment.js";

export const home = async (req, res) => {
  try {
    const dbVideos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", dbVideos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", dbVideos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getRecord = (req, res) => {
  res.render("record", { pageTitle: "Record" });
};

export const postRecord = (req, res) => {
  res.render("record", { pageTitle: "Record" });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    files: { videoFile, thumbnail },
  } = req;
  const fileUrl = videoFile[0].path;
  const thumbnailUrl = thumbnail[0].path;

  const newVideo = await Video.create({
    fileUrl,
    thumbnailUrl,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    await video.comments.forEach((comment) => {
      let creator = Comment.findById(comment).populate("creator");
      console.log(creator);
    });
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};
export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

export const registerView = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const likeVideo = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    user.like.push(id);
    video.like += 1;
    user.save();
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const cancelLike = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const index = user.like.indexOf(id);
    user.like.splice(index, 1);
    video.like -= 1;
    user.save();
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
