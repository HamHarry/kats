import { DeleteStatus } from "../model/delete.type";

export enum PermissionKey {
  EMPLOYEE = 0,
  BOOKING = 1,
  CALENDAR = 2,
  GURANTEE = 3,
  PRODUCT = 4,
  EXPENSE = 5,
  SALARY = 6,
  FINANCE = 7,
  BIN = 8,
  SETTING = 9,
  COMPANY = 10,
  ROLE = 11,
}

export interface PermissionData {
  _id?: string;
  name: string;
  key: PermissionKey;
  hasView: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
}

export interface RoleData {
  _id?: string;
  name: string;
  type: string;
  permissions: PermissionData[];
  delete: DeleteStatus;
}

export const permissionList: PermissionData[] = [
  {
    name: "EMPLOYEE",
    key: PermissionKey.EMPLOYEE,
    hasView: true,
    hasEdit: false,
    hasDelete: true,
  },
  {
    name: "BOOKING",
    key: PermissionKey.BOOKING,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "CALENDAR",
    key: PermissionKey.CALENDAR,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "GURANTEE",
    key: PermissionKey.GURANTEE,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "PRODUCT",
    key: PermissionKey.PRODUCT,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "SALARY",
    key: PermissionKey.SALARY,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "BIN",
    key: PermissionKey.BIN,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "EXPENSE",
    key: PermissionKey.EXPENSE,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "FINANCE",
    key: PermissionKey.FINANCE,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "SETTING",
    key: PermissionKey.SETTING,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "COMPANY",
    key: PermissionKey.COMPANY,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
  {
    name: "ROLE",
    key: PermissionKey.ROLE,
    hasView: false,
    hasEdit: false,
    hasDelete: false,
  },
];
