import express from "express";
import passport from "passport";
import {
  getJoin,
  getLogin,
  getMe,
  githubLogin,
  kakaoLogin,
  logout,
  postGithubLogin,
  postJoin,
  postKakaoLogin,
  postLogin,
} from "../Controllers/userController";
import {
  home,
  homeHot,
  homeLiked,
  homeSubscribed,
  search,
} from "../Controllers/videoController";
import { onlyPrivate, onlyPublic } from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.liked, homeLiked);
globalRouter.get(routes.subscribed, homeSubscribed);
globalRouter.get(routes.hot, homeHot);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.search, search);

globalRouter.get(routes.github, githubLogin);

globalRouter.get(routes.me, getMe);

globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);

globalRouter.get(routes.kakaotalk, kakaoLogin);
globalRouter.get(
  routes.kakaotalkCallback,
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  postKakaoLogin
);

export default globalRouter;
