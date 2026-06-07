"use client"

import './globals.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Script from 'next/script';

import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { SnackbarProvider } from 'notistack';
import { PersistGate } from "redux-persist/lib/integration/react";
import { StyledEngineProvider } from "@mui/material";
import HeaderComp from "@/component/header-comp/header-comp";
import Image from 'next/image';
import RootSocketListener from '@/layout/socket/layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <StyledEngineProvider injectFirst>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <RootSocketListener />
                <HeaderComp />
                {children}
                <Image src={'/bird_animation.gif'} alt="bird animation" width={300} height={200} className="birdAnimation" />
              </SnackbarProvider>
            </PersistGate>
          </Provider>
        </StyledEngineProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
