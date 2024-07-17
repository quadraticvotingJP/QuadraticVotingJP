import React, { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { GA_TRACKING_ID } from "@/lib/gtag";

type Props = {
  readonly format: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  readonly slot: string | undefined;
  readonly dataFullWidthResponsive: boolean;
};

// eslint-disable-next-line react/display-name
const EcAdSense: React.FC<Props> = ({ format, slot, dataFullWidthResponsive }) => {
  const { asPath } = useRouter();
  useEffect(() => {
    const adsScript = document.createElement("script");
    adsScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    adsScript.async = true;
    document.body.appendChild(adsScript);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }

    return () => {
      document.body.removeChild(adsScript);
    };
  }, []);

  return (
    <AsPath key={asPath} className="adsbygoogle">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-adtest="off" // test mode
        data-ad-format={format}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENCE_PUB}
        data-ad-slot={slot}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </AsPath>
  );
};
export default EcAdSense;

const AsPath = styled.div`
  text-align: center;
`;