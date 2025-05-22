import styled from "styled-components";
import {
  DatePicker,
  DatePickerProps,
  Divider,
  Select,
  SelectProps,
} from "antd";
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

export const StyledDivider = styled(Divider)`
  &.ant-divider-horizontal {
    &:before,
    &:after {
      border-top: 2px solid #2656a2;
      border-radius: 20px;
    }
  }

  &.ant-divider-with-text {
    color: #2656a2; // สีข้อความใน Divider
    font-weight: bold;
    font-size: 20px;
  }
`;
