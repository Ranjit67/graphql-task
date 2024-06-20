import { OrganizationModel } from "../models/organization.model";
import UserModel from "../models/user.model";
import JwtService from "../services/jwt.services";
import PasswordHasServices from "../services/passwordhash.services";

export const typeDefsUser = `#graphql
  scalar Date

  enum Role {
    ADMIN
    MANAGER
    USER
  }


  type User {
    _id: ID!
    username: String!
    password: String!
    role: Role!
    organizationId: ID!
    organization: Organization
    createdAt: Date
    updatedAt: Date
  }

  type Query {
   
    users: [User]
    user(id: ID!): User
  }

  input CreateOrganizationInput {
    title: String!
  }

  input UpdateOrganizationInput {
    title: String
  }
  type AuthPayload {
    token: String
    user: User
  }
  type Mutation {
 

    createUser(username: String!, password: String!, role: Role!, organizationId: String!): User
    updateUser(id: String!, username: String, password: String, role: Role, organizationId: String): User
    deleteUser(id: String!): User
    login(username: String!, password: String!): AuthPayload
  }
`;

export const resolversUser = {
  Query: {
    users: async (_: any, __: any, context: any) => {
      if (context.role !== "ADMIN")
        throw new Error("You are not permitted to access this route");

      return await UserModel.find({ organizationId: context?.organizationId });
    },
    user: async (_: any, { id }: { id: string }, context: any) => {
      try {
        if (!context?.userId)
          throw new Error("You are not permitted to perform this action.");
        if (context?.role !== "ADMIN" && context?.userId !== id)
          throw new Error("You can not retrieve other user data.");

        return await UserModel.findById(id);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      try {
        const user = await UserModel.findOne({ username });
        if (!user) {
          throw new Error("No user found with this email");
        }
        const valid = await new PasswordHasServices().compare(
          password,
          user.password
        );
        if (!valid) throw new Error("Incorrect password");
        const token = await new JwtService().accessTokenGenerator(
          JSON.stringify({
            userId: user?._id,
            role: user?.role,
            username: user?.username,
            organizationId: user?.organizationId?.toString(),
          })
        );
        return { token, user };
      } catch (error) {
        throw error;
      }
    },

    createUser: async (
      _: any,
      {
        username,
        password,
        role,
        organizationId,
      }: {
        username: string;
        password: string;
        role: string;
        organizationId: string;
      }
    ) => {
      const user = new UserModel({ username, password, role, organizationId });
      await user.save();
      return user;
    },
    updateUser: async (
      _: any,
      {
        id,
        username,
        password,
        role,
        organizationId,
      }: {
        username: string;
        password: string;
        role: string;
        organizationId: string;
        id: string;
      },
      context: any
    ) => {
      try {
        if (!context?.userId)
          throw new Error("You are not permitted to perform this action.");
        if (context?.role !== "ADMIN" && context?.userId !== id)
          throw new Error("You can not update other user data");
        let update: any = {};
        if (username !== undefined) update.username = username;
        if (password !== undefined) {
          const hashPassword = await new PasswordHasServices().hash(password);
          update.password = hashPassword;
        }
        if (role !== undefined) update.role = role;
        if (organizationId !== undefined)
          update.organizationId = organizationId;
        return await UserModel.findOneAndUpdate({ _id: id }, update, {
          new: true,
        });
      } catch (error) {
        throw error;
      }
    },
    deleteUser: async (
      _: any,
      {
        id,
      }: {
        id: string;
      },
      context: any
    ) => {
      try {
        if (context?.role !== "ADMIN")
          throw new Error("You are not permitted to access this route");
        const deleteUser = await UserModel.findOneAndDelete({
          _id: id,
          organizationId: context?.organizationId,
        });
        if (!deleteUser)
          throw new Error(
            `You are not permitted to delete other organization users.`
          );
        return deleteUser;
      } catch (error) {
        throw error;
      }
    },
  },
  User: {
    organization: async (user: { organizationId: string }) =>
      await OrganizationModel.findById(user.organizationId),
  },
};
