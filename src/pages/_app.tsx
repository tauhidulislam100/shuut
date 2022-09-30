import 'antd/dist/antd.css';
import 'react-phone-input-2/lib/style.css';
import '../styles/globals.css';

import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client';
import { client } from '../graphql/apollo-client';
import AuthProvider from '../contexts/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  )
}

export default MyApp;
