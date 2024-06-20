import { model, Model, Schema } from "mongoose";
import TASK_TYPE from "../types/task";

const taskSchema = new Schema<TASK_TYPE, Model<TASK_TYPE>>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    dueDate: {
      type: Date,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const TaskModel = model<TASK_TYPE, Model<TASK_TYPE>>("Task", taskSchema);
TaskModel.syncIndexes();
export default TaskModel;
