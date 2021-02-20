// Global
const HOME = "/";
const HOT = "/hot";
const LIKED = "/liked";
const SUBSCRIBED = "/subscribed";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";
//

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";
//

// Videos
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const RECORD = "/record";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";
//

//Github
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";
//

//kakaotalk
const KAKAO = "/auth/kakao";
const KAKAO_CALLBACK = "/auth/kakao/callback";
//

// API
const API = "/api";
const REGISTER_VIEW = "/:id/view";
const LIKE = "/:id/like";
const CANCEL_LIKE = "/:id/cancellike";
const ADD_COMMENT = "/:id/comment";
const DEL_COMMENT = "/:id/delcomment";
const SUBSCRIBE = "/:id/subscribe";
const UNSUBSCRIBE = "/:id/unsubscribe";
//

const routes = {
  home: HOME,
  hot: HOT,
  liked: LIKED,
  subscribed: SUBSCRIBED,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  me: ME,
  userDetail: (id) => {
    if (id) {
      return `/users/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  record: RECORD,
  videoDetail: (id) => {
    if (id) {
      return `/videos/${id}`;
    } else {
      return VIDEO_DETAIL;
    }
  },
  editVideo: (id) => {
    if (id) {
      return `/videos/${id}/edit`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: (id) => {
    if (id) {
      return `/videos/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  kakaotalk: KAKAO,
  kakaotalkCallback: KAKAO_CALLBACK,
  api: API,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT,
  delComment: DEL_COMMENT,
  subscribe: SUBSCRIBE,
  unsubscribe: UNSUBSCRIBE,
  like: LIKE,
  cancelLike: CANCEL_LIKE,
};

export default routes;
