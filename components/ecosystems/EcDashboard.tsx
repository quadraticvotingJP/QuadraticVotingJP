// react
import React, { useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { useTranslation } from "next-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { utilsValidationRule } from "@/utils/validation";
// library
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
// context
import { useLoadingContext } from "@/context/LoadingContext";
// domain
import { chartData } from "@/architecture/domain/chart";
// application
import { downloadXlsx } from "@/architecture/application/downloadXlsx";
import { downloadTxt } from "@/architecture/application/downloadTxt";
import { putEvent } from "@/architecture/application/putEvent";

type PublicationStartDate = "publicationStartDate";
type PublicationEndDate = "publicationEndDate";
type Edit = "Edit";
type Save = "Save";
interface Props {
  dashboardData: DashboardData;
  query: ParsedUrlQuery;
}

const EcDashboard: React.FC<Props> = ({ dashboardData, query }) => {
  const { t } = useTranslation("common");
  const { excelFile } = downloadXlsx(); // ダウンロード
  const { textFile } = downloadTxt(); // ダウンロード
  const { setLoading } = useLoadingContext(); // loading
  const { updateEvent } = putEvent(); // api
  const adminUser: boolean = query.secret === dashboardData.secretKey; // 閲覧権限
  const [isPublicationStartDateEdit, setIsPublicationStartDateEdit] =
    useState<boolean>(false); // 編集ボタン制御
  const [isPublicationEndDateEdit, setIsPublicationEndDateEdit] =
    useState<boolean>(false); // 編集ボタン制御
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<DashboardFormVales>({
    defaultValues: {
      publicationStartDate: dashboardData.formPublicationStartDate,
      publicationEndDate: dashboardData.formPublicationEndDate,
    },
  });

  const changeEditMode = (
    form: PublicationStartDate | PublicationEndDate,
    type: Edit | Save
  ): void => {
    const select = {
      publicationStartDate: form === "publicationStartDate",
      publicationEndDate: form === "publicationEndDate",
      edit: type === "Edit",
      save: type === "Save",
    };
    const is = {
      publicationStartDateEdit: select.publicationStartDate && select.edit,
      publicationStartDateSave: select.publicationStartDate && select.save,
      publicationEndDateEdit: select.publicationEndDate && select.edit,
      publicationEndDateSave: select.publicationEndDate && select.save,
    };
    is.publicationStartDateEdit && setIsPublicationStartDateEdit(true); // 開始日の編集開始
    is.publicationEndDateEdit && setIsPublicationEndDateEdit(true); // 終了日の編集開始
    // 開始日の編集終了
    if (is.publicationStartDateSave) {
      if (errors.publicationStartDate) return; // フォームにエラーがあれば弾く
      setIsPublicationStartDateEdit(false); // 編集ボタンの制御を切り替える
      handleSubmit(onSubmit)(); // 送信
    }
    // 終了日の編集終了
    if (is.publicationEndDateSave) {
      if (errors.publicationEndDate) return; // フォームにエラーがあれば弾く
      setIsPublicationEndDateEdit(false); // 編集ボタンの制御を切り替える
      handleSubmit(onSubmit)(); // 送信
    }
  };

  // グラフデータの生成
  const grafData: ChartData<"bar", number[], string> = chartData(
    dashboardData.grafOptions,
    dashboardData.grafEffectiveVotes,
    dashboardData.grafPercentCredits
  );
  // 投票数・投票率ダウンロード
  const downloadXLSX = () =>
    excelFile(
      dashboardData.grafOptions,
      dashboardData.grafEffectiveVotes,
      dashboardData.grafPercentCredits
    );
  // 投票者リンクダウンロード
  const downloadTXT = () => textFile(dashboardData.voterLinks);

  // 日付制御用に本日の日付を取得
  const newDate = new Date();
  const today = `${newDate.getFullYear()}-${(
    "0" +
    (newDate.getMonth() + 1)
  ).slice(-2)}-${("0" + newDate.getDate()).slice(-2)}T00:00`;

  // 公開開始日・公開終了日の更新
  const onSubmit: SubmitHandler<DashboardFormVales> = async (
    data: DashboardFormVales
  ) => {
    const documentId = query[""]!;
    // apiを叩く
    setLoading(true);
    await updateEvent(data, "event", documentId);
    setLoading(false);
  };

  return (
    <>
      <AtH2 title={t("pageTitle.dashboard")} />
      <br />
      <OrCardProcess
        labelTitle={t("common.dashboard.participantAndEffectiveVotes.title")}
        leftForm={{
          title: t("common.dashboard.participant.title"),
          molecule: dashboardData.participantVotesMolecule,
          denominator: dashboardData.participantVotesDenominator,
        }}
        rightForm={{
          title: t("common.dashboard.effectiveVotes.title"),
          molecule: dashboardData.effectiveVotesMolecule,
          denominator: dashboardData.effectiveVotesDenominator,
        }}
      />
      <br />
      <OrCardBar
        title={t("common.dashboard.effectiveVotesAndPercentCredits.title")}
        required={false}
        data={grafData}
        button={{
          title: t("common.button.downloadXlsx"),
          disabled: false,
          size: "large",
          onClick: downloadXLSX,
        }}
      />
      <br />
      <OrCardText
        title={t("common.event.eventTitle.title")}
        required={false}
        contents={dashboardData.title}
        showEdit={false}
        disabled={false}
      />
      <br />
      <OrCardText
        title={t("common.event.overview.title")}
        required={false}
        contents={dashboardData.overview}
        showEdit={false}
        disabled={false}
      />
      <br />

      {isPublicationStartDateEdit ? (
        <OrCardForm
          showSave
          title={t("common.event.publicationStartDate.title")}
          defaultValue={dashboardData.formPublicationStartDate}
          required={true}
          register={register("publicationStartDate", {
            required: utilsValidationRule.REQUIRED,
            validate: {
              // 開始日と終了日の比較validation
              value: (v) =>
                new Date(v) < new Date(getValues("publicationEndDate"))
                  ? true
                  : utilsValidationRule.START_DATE.message,
            },
          })}
          min={today}
          error={errors.publicationStartDate}
          placeholder=""
          disabled={false}
          type="datetime-local"
          id="publicationStartDate"
          name="publicationStartDate"
          onClick={() => changeEditMode("publicationStartDate", "Save")}
        />
      ) : (
        <OrCardText
          title={t("common.event.publicationStartDate.title")}
          required={false}
          contents={dashboardData.detailPublicationStartDate}
          showEdit
          disabled={isPublicationEndDateEdit || !adminUser}
          onClick={() => changeEditMode("publicationStartDate", "Edit")}
        />
      )}
      <br />
      {isPublicationEndDateEdit ? (
        <OrCardForm
          showSave
          title={t("common.event.publicationEndDate.title")}
          defaultValue={dashboardData.formPublicationEndDate}
          required={true}
          register={register("publicationEndDate", {
            required: utilsValidationRule.REQUIRED,
            validate: {
              // 開始日と終了日の比較validation
              value: (v) =>
                new Date(v) > new Date(getValues("publicationStartDate"))
                  ? true
                  : utilsValidationRule.END_DATE.message,
            },
          })}
          min={today}
          placeholder=""
          disabled={false}
          type="datetime-local"
          id="publicationEndDate"
          name="publicationEndDate"
          onClick={() => changeEditMode("publicationEndDate", "Save")}
          error={errors.publicationEndDate}
        />
      ) : (
        <OrCardText
          title={t("common.event.publicationEndDate.title")}
          required={false}
          contents={dashboardData.detailPublicationEndDate}
          showEdit
          disabled={isPublicationStartDateEdit || !adminUser}
          onClick={() => changeEditMode("publicationEndDate", "Edit")}
        />
      )}
      <br />
      <OrCardForm
        readOnly={true}
        title={t("common.dashboard.participantDashboard.title")}
        defaultValue={`http://localhost:4000/dashboard/id?=${dashboardData.participantDashboardLink}`}
        required={false}
        placeholder=""
        disabled={false}
        type="text"
        id="participantDashboard"
        name="participantDashboard"
      />
      <br />
      {adminUser && (
        <OrCardForm
          readOnly={true}
          title={t("common.dashboard.adminDashboard.title")}
          defaultValue={`http://localhost:4000/dashboard/id?=${dashboardData.adminDashboardLink}`}
          required={false}
          placeholder=""
          disabled={false}
          type="text"
          id="adminDashboard"
          name="adminDashboard"
        />
      )}
      <br />
      {adminUser && (
        <OrCardTextField
          title={t("common.dashboard.votersLink.title")}
          required={false}
          overView={t("common.dashboard.votersLink.detail")}
          defaultValue={dashboardData.voterLinks}
          id={"votersLink"}
          name={"votersLink"}
          type="text"
          rows={10}
          inputProps={{ readOnly: true }}
          button={{
            title: t("common.button.downloadTxt"),
            disabled: false,
            size: "large",
            onClick: downloadTXT,
          }}
        />
      )}
    </>
  );
};
export default EcDashboard;
