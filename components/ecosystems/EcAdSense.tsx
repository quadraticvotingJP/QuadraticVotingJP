import React, { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { GA_TRACKING_ID } from "@/lib/gtag";

type Props = {
  readonly client: string | undefined;
  readonly slot: string | undefined;
};
// eslint-disable-next-line react/display-name
const EcAdSense: React.FC<Props> = ({ client, slot }) => {
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
        data-ad-format="auto"
        data-ad-client={client}
        data-ad-slot={slot}
        data-full-width-responsive="true"
      />
    </AsPath>
  );
};
export default EcAdSense;

const AsPath = styled.div`
  text-align: center;
`;
