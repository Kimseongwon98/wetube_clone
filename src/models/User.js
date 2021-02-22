import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: {
    type: String,
    default: "/uploads/avatars/09269213a59e75c7ece1c825dd999157",
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
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
