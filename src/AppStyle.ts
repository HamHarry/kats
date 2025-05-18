import styled from "styled-components";
import { DatePicker, DatePickerProps, Select, SelectProps } from "antd";
import { Dayjs } from "dayjs";

export const DatePickerStyle = styled(DatePicker)<DatePickerProps<Dayjs>>`
  &.ant-picker-disabled .ant-picker-input > input {
    background-color: #f5f5f5 !important;
    color: black !important;
    cursor: not-allowed !important;

    .ant-picker-input > input {
      cursor: not-allowed !important;
    }
  }

  &.ant-picker-disabled {
    background-color: #f5f5f5 !important;
  }
`;

export const StyledSelect = styled(Select)<SelectProps<any>>`
  &.ant-select-disabled {
    .ant-select-selector {
      background-color: #f0f0f0 !important;
      color: black !important;
    }
  }
`;
