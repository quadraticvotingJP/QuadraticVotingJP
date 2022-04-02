import React from "react";
import { useTranslation } from "next-i18next";
import { ChartData } from "chart.js";
// Component
import { AtH2 } from "@/components/atoms/EntryPoint";
import {
  OrCardText,
  OrCardProcess,
  OrCardForm,
  OrCardTextField,
  OrCardBar,
} from "@/components/organisms/EntryPoint";
// architecture
import { setGrafColorPattern } from "@/architecture/application/setGrafColorPattern";

const EcDashboard: React.FC = () => {
  const { setColor } = setGrafColorPattern();
  const { t } = useTranslation("common");
  const labels = [
    "有村架純",
    "宇垣美里",
    "田中みな実",
    "夏菜",
    "西内まりあ",
    "与田祐希",
    "橋本奈々未",
  ];
  const color = setColor(labels.length);
  const data: ChartData<"bar", number[], string> = {
    // x 軸のラベル
    labels: labels,
    datasets: [
      {
        // 横軸
        indexAxis: "y",
        // ラベル名
        label: "選択肢",
        // データの値
        data: [35, 100, 40, 41, 66, 55, 40],
        // グラフの背景色
        backgroundColor: color.background,
        // グラフの枠線の色
        borderColor: color.border,
        // グラフの枠線の太さ
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <AtH2 title={t("pageTitle.dashboard")} />
      <br />
      <OrCardProcess
        labelTitle={t("common.dashboard.participantAndVotes.title")}
        leftForm={{
          title: t("common.dashboard.participant.title"),
          molecule: "21",
          denominator: "39",
        }}
        rightForm={{
          title: t("common.dashboard.votes.title"),
          molecule: "3900",
          denominator: "1500",
        }}
      />
      <br />
      <OrCardBar
        title={t("common.dashboard.voterTurnout.title")}
        required={false}
        data={data}
      />
      <br />
      <OrCardText
        title={t("common.event.eventTitle.title")}
        required={false}
        contents={"次の都知事は誰？"}
        showEdit={false}
        disabled={false}
      />
      <br />
      <OrCardText
        title={t("common.event.overview.title")}
        required={false}
        contents={"都知事を決めるための選挙を行います"}
        showEdit={false}
        disabled={false}
      />
      <br />
      <OrCardText
        title={t("common.event.publicationStartDate.title")}
        required={false}
        contents={"2020月4月1日"}
        showEdit
        disabled={false}
      />
      <br />
      <OrCardText
        title={t("common.event.publicationEndDate.title")}
        required={false}
        contents={"2022月4月1日"}
        showEdit
        disabled={false}
      />
      <br />
      <OrCardForm
        readOnly={true}
        title={t("common.dashboard.participantDashboard.title")}
        defaultValue="https://github.com/quadraticvotingJP/quadratic-voting-jp/projects/1"
        required={false}
        placeholder=""
        disabled={false}
        type="text"
        id="participantDashboard"
        name="participantDashboard"
      />
      <br />
      <OrCardForm
        readOnly={true}
        title={t("common.dashboard.adminDashboard.title")}
        defaultValue="https://github.com/quadraticvotingJP/quadratic-voting-jp/projects/1"
        required={false}
        placeholder=""
        disabled={false}
        type="text"
        id="adminDashboard"
        name="adminDashboard"
      />
      <br />
      <OrCardTextField
        title={t("common.dashboard.votersLink.title")}
        required={false}
        overView={t("common.dashboard.votersLink.detail")}
        defaultValue={
          "aaaaaaaaaaaaaaaaa\n1111111111\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee\neeeee"
        }
        id={"votersLink"}
        name={"votersLink"}
        type="text"
        rows={10}
        maxRows={10}
        inputProps={{ readOnly: true }}
        button={{
          title: t("common.button.download"),
          disabled: false,
          size: "large",
          onClick: () => {},
        }}
      />
    </>
  );
};
export default EcDashboard;
