import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const { user } = req;
  try {
    const dbVideos = await Video.find({}).sort({ _id: -1 });
    if (user) {
      const me = await User.findById(user).populate("subscribing");
      res.render("home", { pageTitle: "Home", dbVideos, me });
    } else {
      res.render("home", { pageTitle: "Home", dbVideos });
    }
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", dbVideos: [] });
  }
};

export const homeHot = async (req, res) => {
  const { user } = req;
  try {
    const dbVideos = await Video.find({}).sort({ views: -1 });
    if (user) {
      const me = await User.findById(user).populate("subscribing");
      res.render("homeHot", { pageTitle: "Home", dbVideos, me });
    } else {
      res.render("homeHot", { pageTitle: "Home", dbVideos });
    }
  } catch (error) {
    console.log(error);
    res.render("homeHot", { pageTitle: "Home", dbVideos: [] });
  }
};

export const homeLiked = async (req, res) => {
  const { user } = req;
  try {
    const dbVideos = [];
    let i = 0;
    const me = await User.findById(user).populate("subscribing");
    me.like.forEach(async (channel) => {
      const video = await Video.findById(channel);
      dbVideos.push(video);
      i += 1;
      if (me.like.length === i) {
        res.render("homeLiked", { pageTitle: "Home", dbVideos, me });
      }
    });
  } catch (error) {
    console.log(error);
    res.render("homeLiked", { pageTitle: "Home", dbVideos: [] });
  }
};

export const homeSubscribed = async (req, res) => {
  const { user } = req;
  try {
    const me = await User.findById(user).populate([
      {
        path: "subscribing",
        model: "User",
        populate: {
          path: "videos",
          model: "Video",
        },
      },
    ]);
    const dbVideos = me.subscribing;

    res.render("homeSubscribed", { pageTitle: "Home", dbVideos, me });
  } catch (error) {
    console.log(error);
    res.render("homeSubscribed", { pageTitle: "Home", dbVideos: [] });
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
    let comments = await Video.findById(id).populate([
      {
        path: "comments",
        model: "Comment",
        populate: {
          path: "creator",
          model: "User",
        },
      },
    ]);
    comments = comments.comments;
    const video = await Video.findById(id).populate("creator");
    res.render("videoDetail", { pageTitle: video.title, video, comments });
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
      video: id,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDelComment = async (req, res) => {
  const {
    params: { id },
    body: { videoId },
  } = req;
  try {
    await Comment.findByIdAndRemove({ _id: id });
    const video = await Video.findById(videoId);
    const index = video.comments.indexOf(id);
    video.comments.splice(index, 1);
    video.save();
  } catch (error) {
    console.log(error);
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
