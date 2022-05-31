import { useRouter } from "next/router";
// hooks
import { useEffect } from "react";
// i18n
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
// tailwind or css
import "../styles/globals.css";
import "../styles/tailwind.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
// firebase
import { authentication } from "@/firebase/initialize";
import { signInAnonymously } from "firebase/auth";
// component
import { MoHeader, MoFooter } from "@/components/molecules/EntryPoint";
import { EcAdvertisement } from "@/components/ecosystems/EntryPoint";
// context
import { LoadingProvider } from "@/context/LoadingContext";
// application
import { routerPush } from "@/architecture/application/routing";

function MyApp({ Component, pageProps, router }: AppProps) {
  const Router = useRouter();
  // 匿名ログイン
  useEffect(() => {
    signInAnonymously(authentication);
  }, []);

  // GoogleAnalytics4
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}"`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', { page_path: window.location.pathname });
            `,
        }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap"
        rel="stylesheet"
      />
      <LoadingProvider>
        <MoHeader />
        <div className="flex mt-14 sm:mt-16 min-h-screen">
          {/* <EcAdvertisement className="w-1/5 bg-gray-400" /> */}
          <div className="w-full mx-10 mt-16 mb-32">
            <Component {...pageProps} />
          </div>
          {/* <EcAdvertisement className="w-1/5 bg-gray-400" /> */}
        </div>
        <MoFooter />
      </LoadingProvider>
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
