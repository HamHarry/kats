import styled from "styled-components";
import { DatePicker, DatePickerProps } from "antd";
import { Dayjs } from "dayjs";

export const DatePickerStyle = styled(DatePicker)<DatePickerProps<Dayjs>>`
  &.ant-picker-disabled .ant-picker-input > input {
    background-color: #f5f5f5 !important;
    cursor: not-allowed !important;

    .ant-picker-input > input {
      cursor: not-allowed !important;
    }
  }

  &.ant-picker-disabled {
    background-color: #f5f5f5 !important;
  }
`;
