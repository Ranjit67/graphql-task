import { Document, ObjectId } from "mongoose";
import ORGANIZATION_TYPE from "./organization";

export type STATUS = "PENDING" | "COMPLETED";

export default interface TASK_TYPE extends Document {
  title: string;
  description: string;
  status: STATUS;
  dueDate: Date;
  userId: ObjectId;
  organizationId: ObjectId;
}
