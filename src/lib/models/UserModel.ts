import mongoose, { models, Schema } from "mongoose";
export interface signupType extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}
const UserSchema = new Schema<signupType>({
 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  
});
const User = models.User|| mongoose.model("User", UserSchema);
export default User;
