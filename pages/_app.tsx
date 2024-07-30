import React from 'react';
import { AppProps } from 'next/app';
import {NextUIProvider} from "@nextui-org/react";
import { AuthProvider } from '../hooks/authContext';
import Head from 'next/head';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>

      <AuthProvider>

        <Head>
          <title>TCG Market Value</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Component {...pageProps} />
        
      </AuthProvider>

    </NextUIProvider>

    
  );
}

export default MyApp;