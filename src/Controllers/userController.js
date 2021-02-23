import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords dont match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome!",
  failureFlash: "Can't log in. Check email and/or password",
});

export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome!",
  failureFlash: "Can't log in",
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ $or: [{ email }, { githubId: id }] });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const kakaoLogin = passport.authenticate("kakao", {
  successFlash: "Welcome!",
  failureFlash: "Can't log in",
});

export const kakaoLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: {
      id,
      properties: { nickname, profile_image: avatarUrl },
      kakao_account: { email },
    },
  } = profile;
  try {
    const user = await User.findOne({ $or: [{ email }, { kakaoId: id }] });
    if (user) {
      user.kakaoId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name: nickname,
      kakaoId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postKakaoLogin = (req, res) => {
  res.redirect(routes.home);
};

export const postMoreInfo = async (req, res) => {
  const {
    user: { id },
    body: { password, password2, email },
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match");
    res.status(400);
    res.redirect(routes.home);
    return;
  }
  try {
    if (email) {
      await User.findByIdAndUpdate(id, {
        email,
      });

      await req.user.setPassword(password);
      res.redirect(routes.home);
    }
    req.flash("success", "Profile updated");
  } catch (error) {
    req.flash("error", "Can't update profile");
    res.redirect(routes.home);
  }
};

export const logout = (req, res) => {
  req.flash("info", "Logged out, see you later");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const {
    user: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "My Profile", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.user("error", "User not found");
    res.redirect(routes.home);
  }
};

export const subscribeProfile = (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    user.subscribing.push(id);
    user.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const unsubscribeProfile = (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  try {
    const index = user.subscribing.indexOf(id);
    user.subscribing.splice(index, 1);
    user.save();
  } catch (error) {
    console.log(error);
    res.status(400);
  } finally {
    res.end();
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    user: { _id: id },
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't update profile");
    res.render("editProfile", { pageTitle: "Edit Profile" });
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  try {
    if (newPassword !== newPassword2) {
      req.flash("error", "Passwords don't match");
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password");
    res.status(400);
    res.redirect(`/users/${routes.editProfile}`);
  }
};