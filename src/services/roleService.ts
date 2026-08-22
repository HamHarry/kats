import { RoleData } from "../data/permissions";
import { ApiResponse } from "../model/api.type";
import { DeleteStatus } from "../model/delete.type";
import { HttpClient } from "../shared/utils/HttpClient";

export interface RoleUpdateBody {
  roleId: string;
  data: RoleData;
}

export const createRole = async (payload: RoleData): ApiResponse<RoleData> => {
  const response = await HttpClient.post(`/permissions/role`, payload);

  return response;
};

export const getAllRoles = async (delet = DeleteStatus.ISNOTDELETE): ApiResponse<RoleData[]> => {
  const response = await HttpClient.get(`/permissions/role?delete=${delet}`);

  return response;
};

export const getAllRolesForPermission = async (): ApiResponse<RoleData[]> => {
  const response = await HttpClient.get(`/permissions/role/authz`);

  return response;
};

export const getRoleById = async (roleId: string): ApiResponse<RoleData> => {
  const response = await HttpClient.get(`/permissions/role/${roleId}`);

  return response;
};

export const updateRoleById = async (body: RoleUpdateBody): ApiResponse<RoleData> => {
  const response = await HttpClient.put(`/permissions/role/update/${body.roleId}`, body.data);

  return response;
};

export const isDeleteRoleById = async (body: RoleData): ApiResponse<RoleData> => {
  const response = await HttpClient.post(`/permissions/role/selectDelete/${body._id}`, body);

  return response;
};

export const DeleteRoleById = async (roleId: string): ApiResponse<RoleData> => {
  const response = await HttpClient.delete(`/permissions/role/delete/${roleId}`);

  return response;
};
