import React from "react";
import { BASE_CSS } from "@/utils/baseCss";
import { sp, tab } from "@/media";
import styled from "styled-components";
// component
import {
  AtLabel,
  AtInput,
  AtNoMarkLabel,
  AtIconButton,
  AtErrorMessage,
} from "@/components/atoms/EntryPoint";
import { LabelArea, LabelTitle } from "@/components/shared/EntryPoint";

// hook
import { UseFormRegisterReturn } from "react-hook-form";

export type Props = {
  // label
  readonly title: string;
  readonly required: boolean;
  readonly overView?: string;
  // form
  readonly placeholder: string;
  readonly disabled: boolean;
  readonly type: Readonly<FormType>;
  readonly id: string;
  readonly name: string;
  readonly error?: any;
  readonly register?: UseFormRegisterReturn;
  readonly defaultValue?: string;
  readonly readOnly?: boolean;
  readonly labelMark?: boolean;
  readonly showSave?: boolean;
  readonly onClick?: () => void;
  readonly onWheel?: <T>(arg: T) => void;
};

// eslint-disable-next-line react/display-name
export const MoLabelForm: React.FC<Props> = ({
  // label
  title,
  required,
  overView,
  // form
  register,
  id,
  name,
  placeholder,
  disabled,
  type,
  readOnly,
  defaultValue,
  error,
  showSave,
  onClick,
  onWheel,
  labelMark = true,
}) => {
  return (
    <>
      <LabelArea>
        <LabelTitle>
          {labelMark ? (
            <AtLabel required={required} title={title} />
          ) : (
            <AtNoMarkLabel required={required} title={title} />
          )}
        </LabelTitle>
        {overView && <OverView>{overView}</OverView>}
      </LabelArea>
      {showSave ? (
        <>
          <EditElement>
            <div>
              <AtInput
                defaultValue={defaultValue}
                register={register}
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                onWheel={onWheel}
              />
              <AtErrorMessage error={error} />
            </div>
            <AtIconButton size="small" showSave={showSave} onClick={onClick} />
          </EditElement>
        </>
      ) : (
        <>
          <AtInput
            defaultValue={defaultValue}
            register={register}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onWheel={onWheel}
          />
          <AtErrorMessage error={error} />
        </>
      )}
    </>
  );
};
const OverView = styled.div`
  font-size: ${BASE_CSS.form.pc.overView};
  white-space: pre-wrap;
  ${tab`
  `}
  ${sp`
    font-size: ${BASE_CSS.form.sp.overView};
  `}
`;
const EditElement = styled.div`
  display: flex;
  justify-content: space-between;
`;
