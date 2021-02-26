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
    if (me.like.length === 0) {
      res.render("homeLiked", { pageTitle: "Home", dbVideos: [], me });
      return;
    }
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
    res.render("home", { pageTitle: "Home", dbVideos: [] });
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
    console.log(dbVideos);
    res.render("homeSubscribed", { pageTitle: "Home", dbVideos, me });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", dbVideos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingByTerm, tag: searchingByTag },
  } = req;
  let videos = [];
  try {
    if (searchingByTerm) {
      videos = await Video.find({
        $or: [
          { title: { $regex: searchingByTerm, $options: "i" } },
          { description: { $regex: searchingByTerm, $options: "i" } },
        ],
      });
      res.render("search", {
        pageTitle: "Search",
        searchingBy: searchingByTerm,
        videos,
      });
    } else {
      videos = await Video.find({
        tags: { $in: searchingByTag },
      });
      res.render("search", {
        pageTitle: "Search",
        searchingBy: `#${searchingByTag}`,
        videos,
      });
    }
  } catch (error) {
    console.log(error);
  }
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
    body: { title, description, tags },
    files: { videoFile, thumbnail },
  } = req;
  const fileUrl = videoFile[0].location;
  if (thumbnail) {
    const thumbnailUrl = thumbnail[0].location;
    const newVideo = await Video.create({
      fileUrl,
      thumbnailUrl,
      title,
      description,
      tags: tags.split(","),
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
  } else {
    const newVideo = await Video.create({
      fileUrl,
      title,
      description,
      tags: tags.split(","),
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
  }
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
    body: { title, description, tags },
  } = req;
  try {
    await Video.findOneAndUpdate(
      { _id: id },
      { title, description, tags: tags.split(",") }
    );
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
