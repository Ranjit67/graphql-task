import MongodbDatabase from "./config/mongodb.db";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { resolversUser, typeDefsUser } from "./graphQl/user.graphql";
import {
  resolversOrganization,
  typeDefsOrganization,
} from "./graphQl/organization.graphql";
import _ from "lodash";
import { resolversTask, typeDefsTask } from "./graphQl/task.graphql";
import JwtService from "./services/jwt.services";

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: [typeDefsUser, typeDefsOrganization, typeDefsTask],
    resolvers: _.merge(resolversUser, resolversOrganization, resolversTask),
    formatError: (err: any) => {
      console.log(err?.message);
      return err.message;
    },
  });
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      // console.log({ token });

      // Try to retrieve a user with the token
      let payload = null;
      if (token) {
        try {
          const decodedToken = await new JwtService().accessTokenVerify(token);
          if (!decodedToken) throw new Error("");
          // console.log({ decodedToken });
          payload = JSON.parse(decodedToken?.aud);
          return payload;
        } catch (err) {
          // throw err;
        }
        return payload;
      }
    },
  });
  console.log(`
        🚀  Server is running!
        📭  Query at ${url}
      `);
  MongodbDatabase();
}

startApolloServer();
