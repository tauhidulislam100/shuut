import "antd/dist/antd.css";
import "react-phone-input-2/lib/style.css";
import "react-day-picker/dist/style.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/apollo-client";
import AuthProvider from "../contexts/AuthProvider";
import { Wrapper } from "@googlemaps/react-wrapper";
import GlobalStateProvider from "../contexts/GlobalStateProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}
        libraries={["places"]}
        render={(status) => {
          return <h2>{status}</h2>;
        }}
      >
        <AuthProvider>
          <GlobalStateProvider>
            <Component {...pageProps} />
          </GlobalStateProvider>
        </AuthProvider>
      </Wrapper>
    </ApolloProvider>
  );
}

export default MyApp;
