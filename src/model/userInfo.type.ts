import { EmployeeData } from "./employee.type";

export interface LoginRequestData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: UserData;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface UserProfileData {
  userInfo?: UserData;
  employee?: EmployeeData;
}

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  nickName: string;
  userName: string;
  dbname: string;
  phoneNumber: string;
  isOwner: boolean;
  companyName: string;
  roleId: string;
}
