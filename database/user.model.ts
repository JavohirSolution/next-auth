import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    profileImage: String,
}, { timestamps: true });

const User = models.User || model("User", userSchema);

export default User;