import { model, Model, Schema } from "mongoose";
import ORGANIZATION_TYPE from "../types/organization";
import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const organizationSchema = new Schema<
  ORGANIZATION_TYPE,
  Model<ORGANIZATION_TYPE>
>(
  {
    title: {
      type: String,
    },
  },
  { timestamps: true }
);
export const OrganizationModel = model<
  ORGANIZATION_TYPE,
  Model<ORGANIZATION_TYPE>
>("Organization", organizationSchema);
OrganizationModel.syncIndexes();
