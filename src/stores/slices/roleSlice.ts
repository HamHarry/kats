import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as roleService from "../../services/roleService";
import { RoleData } from "../../data/permissions";

const initialState: any = {};

const roleSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const createRole = createAsyncThunk(
  "role/create",
  async (payload: any): Promise<any> => {
    const response = await roleService.createRole(payload);
    return response;
  }
);

export const getAllRoles = createAsyncThunk(
  "role/getAll",
  async (): Promise<any> => {
    const response = await roleService.getAllRoles();
    return response;
  }
);

export const getRoleById = createAsyncThunk(
  "role/getById",
  async (roleId: string): Promise<any> => {
    const response = await roleService.getRoleById(roleId);
    return response;
  }
);

export const updateRoleById = createAsyncThunk(
  "permission/update/id",
  async (body: any): Promise<any> => {
    const response = await roleService.updateRoleById(body);
    return response;
  }
);

export const isDeleteRoleById = createAsyncThunk(
  "role/IsDelete/id",
  async (body: RoleData): Promise<any> => {
    const response = await roleService.isDeleteRoleById(body);
    return response;
  }
);

export const DeleteRoleById = createAsyncThunk(
  "role/delete/getById",
  async (roleId: string): Promise<any> => {
    const response = await roleService.DeleteRoleById(roleId);
    return response;
  }
);

export default roleSlice.reducer;
