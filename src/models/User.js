import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: {
    type: String,
    default:
      "https://we-t-ube.s3.amazonaws.com/avatar/27d734b8299f69d35322bdbaf8e08719",
  },
  kakaoId: Number,
  githubId: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  subscribing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  needMoreInfo: Number,
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
