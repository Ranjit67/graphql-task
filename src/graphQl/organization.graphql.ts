import { OrganizationModel } from "../models/organization.model";
import ORGANIZATION_TYPE from "../types/organization";

export const typeDefsOrganization = `#graphql
  scalar Date

  type Organization {
    title: String
    _id: ID
    createdAt: Date
    updatedAt: Date
  }



  type Query {
    organizations: [Organization]
    organization(id: ID!): Organization
   
  }

  input CreateOrganizationInput {
    title: String!
  }

  input UpdateOrganizationInput {
    title: String
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization
    updateOrganization(id: String!, input: UpdateOrganizationInput!): Organization
    deleteOrganization(id: String!): Organization
   
  }
`;

export const resolversOrganization = {
  Query: {
    organizations: async (): Promise<ORGANIZATION_TYPE[]> => {
      return await OrganizationModel.find();
    },
    organization: async (
      parent: unknown,
      args: { id: string }
    ): Promise<ORGANIZATION_TYPE | null> => {
      return await OrganizationModel.findById(args.id);
    },
  },
  Mutation: {
    createOrganization: async (
      parent: unknown,
      args: { input: { title: string } }
    ): Promise<ORGANIZATION_TYPE> => {
      const newOrganization = new OrganizationModel({
        title: args.input.title,
      });
      return await newOrganization.save();
    },
    updateOrganization: async (
      parent: unknown,
      args: { id: string; input: { title: string } }
    ): Promise<ORGANIZATION_TYPE | null> => {
      const updatedOrganization = await OrganizationModel.findByIdAndUpdate(
        args.id,
        { ...args.input },
        { new: true }
      );
      return updatedOrganization;
    },
    deleteOrganization: async (
      parent: unknown,
      args: { id: string }
    ): Promise<ORGANIZATION_TYPE | null> => {
      return await OrganizationModel.findOneAndDelete({ _id: args.id });
    },
  },
};
