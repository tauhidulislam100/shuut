import cookie from "js-cookie";
import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_HASURA_ENDPOINT });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = cookie.get("token");
  const headers: Record<string, any> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  operation.setContext({
    headers: {
      ...headers,
      "X-Hasura-Role": token ? "user" : "public",
    },
  });

  return forward(operation);
});

export const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});
