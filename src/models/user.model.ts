import { model, Model, Schema } from "mongoose";
import USER_TYPE from "../types/user";
import PasswordHasServices from "../services/passwordhash.services";

const userSchema = new Schema<USER_TYPE, Model<USER_TYPE>>(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "USER"],
      default: "USER",
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
).pre<USER_TYPE>("save", async function (next) {
  this.password = this.password
    ? await new PasswordHasServices().hash(this.password)
    : "";

  next();
});
const UserModel = model<USER_TYPE, Model<USER_TYPE>>("User", userSchema);

UserModel.syncIndexes();
export default UserModel;
