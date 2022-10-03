import 'antd/dist/antd.css';
import 'react-phone-input-2/lib/style.css';
import 'react-day-picker/dist/style.css';
import '../styles/globals.css';

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
