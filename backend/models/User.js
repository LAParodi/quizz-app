import bcrypt from "bcrypt";
import mongoose from "mongoose";

import Poll from "./Poll.js";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    bookmarkedPolls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.pre("remove", async function (next) {
  try {
    await Poll.deleteMany({ creator: this._id });
    await Poll.updateMany(
      { bookmarkedPolls: this._id },
      { $pull: { bookmarkedPolls: this._id } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
