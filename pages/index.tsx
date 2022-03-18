import type { NextPage } from "next";
// component
import { EcExplanation } from "@/components/ecosystems/EntryPoint";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const Top: NextPage = ({}) => {
  return <EcExplanation />;
};
export default Top;

// i18n
export const getStaticProps = async ({ locale = "ja" }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
