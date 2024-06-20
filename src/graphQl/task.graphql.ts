import { OrganizationModel } from "../models/organization.model";
import TaskModel from "../models/task.model";
import UserModel from "../models/user.model";

export const typeDefsTask = `#graphql
 
 

  enum Status {
    PENDING
    COMPLETED
  }


  type Task {
    _id: ID!
    title: String!
    description: String!
    status: Status!
    dueDate: Date!
    userId: ID!
    user: User
    organizationId: ID!
    organization: Organization
    createdAt: Date
    updatedAt: Date
  }

  

  type Query {
   
    tasks(userId:String): [Task]
    task(id: String!): Task
  }

  type Mutation {
 
    createTask(title: String!, description: String!, status: Status, dueDate: String!, userId: String!): Task
    updateTask(id: String!, title: String, description: String, status: Status, dueDate: String, userId: String): Task
    deleteTask(id: String!): Task
  }
`;

export const resolversTask = {
  Query: {
    tasks: async (
      _: any,
      {
        userId,
      }: {
        userId: string;
      },
      context: any
    ) => {
      try {
        if (!context?.role) throw new Error("You are not Authorized");

        const makeQuery: any = {};
        context?.organizationId &&
          (makeQuery["organizationId"] = context?.organizationId);
        userId && (makeQuery["userId"] = userId);
        return await TaskModel.find(makeQuery);
      } catch (error) {
        throw error;
      }
    },
    task: async (_: any, { id }: { id: string }, context: any) => {
      try {
        if (!context?.role) throw new Error("You are not Authorized");
        const findTask = await TaskModel.findOne({
          _id: id,
          organizationId: context?.organizationId,
        });
        return findTask;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createTask: async (
      _: any,
      {
        title,
        description,
        status,
        dueDate,
        userId,
      }: {
        title: string;
        description: string;
        status?: string;
        dueDate: string;
        userId: string;
      },
      context: any
    ) => {
      try {
        if (!context?.role) throw new Error("You are not Authorized");
        if (context?.role !== "ADMIN") {
          if (context?.userId !== userId)
            throw new Error("You have not permission create other user task.");
        }

        const findUser = await UserModel.findOne({ _id: userId });
        if (!findUser) throw new Error(`User not found`);
        const task = new TaskModel({
          title,
          description,
          status,
          dueDate: new Date(dueDate),
          userId,
          organizationId: findUser?.organizationId,
        });
        await task.save();
        return task;
      } catch (error) {
        throw error;
      }
    },
    updateTask: async (
      _: any,
      {
        id,
        title,
        description,
        status,
        dueDate,
        userId,
      }: {
        id: string;
        title: string;
        description: string;
        status: string;
        dueDate: string;
        userId: string;
      },
      context: any
    ) => {
      try {
        if (!context?.role) throw new Error("You are not Authorized");
        if (context?.role !== "ADMIN")
          throw new Error("You have not permission update the task.");
        const update: any = {};
        if (title !== undefined) update.title = title;
        if (description !== undefined) update.description = description;
        if (status !== undefined) update.status = status;
        if (dueDate !== undefined) update.dueDate = new Date(dueDate);
        if (userId !== undefined) update.userId = userId;
        return await TaskModel.findByIdAndUpdate(id, update, { new: true });
      } catch (error) {
        throw error;
      }
    },
    deleteTask: async (_: any, { id }: { id: string }, context: any) => {
      try {
        if (!context?.role) throw new Error("You are not Authorized");
        if (context?.role !== "ADMIN")
          throw new Error("You have not permission to delete the task.");

        return await TaskModel.findOneAndDelete({
          _id: id,
          organizationId: context?.organizationId,
        });
      } catch (error) {
        throw error;
      }
    },
  },

  Task: {
    user: async (task: { userId: string }) =>
      await UserModel.findById(task.userId),
    organization: async (task: { organizationId: string }) =>
      await OrganizationModel.findById(task.organizationId),
  },
};
