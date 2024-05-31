import { useRouter } from "next/router";
import styled from "styled-components";
import { sp, tab } from "@/media";
// GA
import { pageview } from "@/lib/gtag";
// SEO
import { DefaultSeo } from "next-seo";
import { SEO } from "@/lib/next-seo.config";
// hooks
import { useEffect, useState } from "react";
import { useScreenSize } from "@/architecture/hooks/ screenSize";
// i18n
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config.js";
// css
import "../styles/reset.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
// firebase
import { authentication } from "@/firebase/initialize";
import { signInAnonymously } from "firebase/auth";
// component
import { MoHeader, MoFooter } from "@/components/molecules/EntryPoint";
import { EcAdSense, EcLoading } from "@/components/ecosystems/EntryPoint";
// application
import { routerPush } from "@/architecture/application/routing";

function MyApp({ Component, pageProps }: AppProps) {
  const RESPONSIVE = useScreenSize();
  const router = useRouter();
  const isLandingPage: boolean = router.route === "/";
  const SIZE_PC_TAB = RESPONSIVE.SIZE_PC || RESPONSIVE.SIZE_TAB;

  // 匿名ログイン
  useEffect(() => {
    signInAnonymously(authentication);
  }, []);

  // googleAnalytics4
  // https://fwywd.com/tech/next-ga-pv
  useEffect(() => {
    const handleRouteChange = (url: any) => pageview(url);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Loading
  const [pageLoading, setPageLoading] = useState(false);
  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setPageLoading(true);
    const handleComplete = () => setPageLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <>
      <DefaultSeo {...SEO} />
      <Container>
        <MoHeader isLandingPage={isLandingPage} />
        {pageLoading ? (
          <EcLoading />
        ) : (
          <>
            {isLandingPage ? (
              <LPMain>
                <Component {...pageProps} />
                <BottomAdSense>{/* <EcAdSense /> */}</BottomAdSense>
              </LPMain>
            ) : (
              <Main>
                <Page>
                  <Component {...pageProps} />
                  {RESPONSIVE.SIZE_SP && (
                    <BottomAdSense>
                      <EcAdSense
                        client={process.env.NEXT_PUBLIC_GOOGLE_ADSENCE_PUB}
                        slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENCE_SLOT}
                      />
                    </BottomAdSense>
                  )}
                </Page>
                {SIZE_PC_TAB && (
                  <PageAdSense>
                    <EcAdSense
                      client={process.env.NEXT_PUBLIC_GOOGLE_ADSENCE_PUB}
                      slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENCE_SLOT}
                    />
                  </PageAdSense>
                )}
              </Main>
            )}
          </>
        )}
        <MoFooter />
      </Container>
    </>
  );
}
export default appWithTranslation(MyApp, nextI18NextConfig);

const Container = styled.div`
  position: relative;
  min-height: 100vh;
`;
const Main = styled.main`
  background-color: #f6f6f6;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 100px 40px 200px 40px;
  ${tab`
    padding: 100px 20px 200px 20px;
  `}
  ${sp`
    padding: 60px 10px 200px 10px;
  `}
`;
const Page = styled.div`
  width: 768px;
  ${tab`
  `}
  ${sp`
    width: 100%;
  `}
`;
const PageAdSense = styled.div`
  min-width: 400px;
  padding-top: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LPMain = styled.main`
  width: 100%;
  padding: 65px 0px 200px 0px;
  display: flex;
  flex-direction: column;
`;
const BottomAdSense = styled.div`
  width: 100%;
  padding-top: 20px;
  display: flex;
  justify-content: center;
`;
