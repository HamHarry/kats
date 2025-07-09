import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";
import Cookies from "js-cookie";
import { cookieConstants } from "../../constants";
import { UserData } from "../../model/userInfo.type";
import { RootState } from "../store";

export interface AuthState {
  userInfo?: UserData;
  companyInfo?: any;
  employeeData?: any;
  isAuthented: boolean;
  checkedAuthenticated: boolean;
}

const initialState: AuthState = {
  checkedAuthenticated: false,
  isAuthented: false,
};

export const clearAuthState = () => {
  Cookies.remove(cookieConstants.TOKEN_KEY);
  Cookies.remove(cookieConstants.TOKEN_EXPIRES_IN);
  Cookies.remove(cookieConstants.REFRESH_TOKEN_KEY);
  Cookies.remove(cookieConstants.REFRESH_TOKEN_EXPIRES_IN);
};

const authSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {
    logOut: (state: AuthState) => {
      clearAuthState();

      state.isAuthented = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreProfile.pending, (state) => {
      state.isAuthented = false;
      state.checkedAuthenticated = false;
    });
    builder.addCase(restoreProfile.fulfilled, (state, action) => {
      state.checkedAuthenticated = true;
      if (action.payload.data) {
        state.isAuthented = true;
        state.companyInfo = action.payload.data.company;
        state.employeeData = action.payload.data.employee;
        state.userInfo = action.payload.data.user;
      } else {
        state.isAuthented = false;
      }
    });
    builder.addCase(restoreProfile.rejected, (state) => {
      const userToken = Cookies.get(cookieConstants.TOKEN_KEY);
      state.checkedAuthenticated = true;
      if (userToken) {
        state.isAuthented = true;
      } else {
        state.isAuthented = false;
        state.companyInfo = undefined;
        state.employeeData = undefined;
        state.userInfo = undefined;
      }
    });
  },
});

export const login = createAsyncThunk("auth/login", async (payload: any): Promise<any> => {
  const response = await authService.login(payload);

  if (response?.data) {
    const { accessToken, expiresIn, refreshToken, refreshExpiresIn } = response.data;
    if (accessToken) {
      Cookies.set(cookieConstants.TOKEN_KEY, accessToken);
      Cookies.set(cookieConstants.TOKEN_EXPIRES_IN, expiresIn);
      Cookies.set(cookieConstants.REFRESH_TOKEN_KEY, refreshToken);
      Cookies.set(cookieConstants.REFRESH_TOKEN_EXPIRES_IN, refreshExpiresIn);
    }
  }

  return response;
});

export const restoreProfile = createAsyncThunk("users/profile", async (_, { rejectWithValue }) => {
  try {
    const userToken = Cookies.get(cookieConstants.TOKEN_KEY);
    if (userToken) {
      const result = await authService.getUserProfile();

      return result;
    } else {
      return { success: true, data: undefined, message: "" };
    }
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const companyInfoSelector = (store: RootState) => store.authReducer.companyInfo;
export const employeeDataSelector = (store: RootState) => store.authReducer.employeeData;
export const userInfoSelector = (store: RootState) => store.authReducer.userInfo;
export const isAuthentedSelector = (store: RootState) => store.authReducer.isAuthented;
export const checkedAuthenticatedSelector = (store: RootState): boolean =>
  store.authReducer.checkedAuthenticated;

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
