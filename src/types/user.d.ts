import { Document, ObjectId } from "mongoose";
import ORGANIZATION_TYPE from "./organization";

export type ROLE = "ADMIN" | "MANAGER" | "USER";

export default interface USER_TYPE extends Document {
  username: string;
  password: string;
  role: ROLE;
  organizationId: ObjectId;
  organization?: ORGANIZATION_TYPE;
}
