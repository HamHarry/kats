import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";
import Cookies from "js-cookie";
import { cookieConstants } from "../../constants";
import { UserData } from "../../model/userInfo.type";

export interface AuthState {
  userInfo?: UserData;
  companyInfo?: any;
  employeeData?: any;
  isAuthented: boolean;
}

const initialState: AuthState = {
  isAuthented: false,
};

const authSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(restoreProfile.pending, (state) => {
      state.isAuthented = false;
    });
    builder.addCase(restoreProfile.fulfilled, (state, action) => {
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

export const login = createAsyncThunk(
  "auth/login",
  async (payload: any): Promise<any> => {
    const response = await authService.login(payload);

    if(response?.data) {
      const {accessToken, expiresIn, refreshToken, refreshExpiresIn}= response.data;
      if (accessToken) {
        Cookies.set(cookieConstants.TOKEN_KEY, accessToken)
        Cookies.set(cookieConstants.TOKEN_EXPIRES_IN, expiresIn)
        Cookies.set(cookieConstants.REFRESH_TOKEN_KEY, refreshToken)
        Cookies.set(cookieConstants.REFRESH_TOKEN_EXPIRES_IN, refreshExpiresIn)  
      }
    }

    return response;
  }
);

export const restoreProfile = createAsyncThunk(
  "users/profile",
  async (_, { rejectWithValue, dispatch }) => {
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
  }
);

export default authSlice.reducer;
