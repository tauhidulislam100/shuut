import cookie from "js-cookie";
import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

function getHeaders() {
  const headers: Record<string, any> = {};
  const token = cookie.get("token");

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["X-Hasura-Role"] = `user`;
  } else {
    headers["X-Hasura-Role"] = "public";
  }

  return headers;
}

const httpLink = new HttpLink({
  uri: `https://${process.env.NEXT_PUBLIC_HASURA_ENDPOINT}`,
  fetch: (uri: RequestInfo, options: RequestInit) => {
    options.headers = getHeaders();
    return fetch(uri, options);
  },
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `wss://${process.env.NEXT_PUBLIC_HASURA_ENDPOINT}`,
          connectionParams() {
            return { headers: getHeaders() };
          },
        })
      )
    : null;

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   const token = cookie.get("token");
//   const headers: Record<string, any> = {};

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   operation.setContext({
//     headers: {
//       ...headers,
//       "X-Hasura-Role": token ? "user" : "public",
//     },
//   });

//   return forward(operation);
// });

const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
