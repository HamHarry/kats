import { RoleData } from "../data/permissions";
import { DeleteStatus } from "../model/delete.type";
import { HttpClient } from "../shared/utils/HttpClient";

export const createRole = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/permissions/role`, payload);

  return response;
};

export const getAllRoles = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/permissions/role?delete=${delet}`);

  return response;
};

export const getAllRolesForPermission = async (): Promise<any> => {
  const response = await HttpClient.get(`/permissions/role/authz`);

  return response;
};

export const getRoleById = async (roleId: string): Promise<any> => {
  const response = await HttpClient.get(`/permissions/role/${roleId}`);

  return response;
};

export const updateRoleById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(`/permissions/role/update/${body.roleId}`, body.data);

  return response;
};

export const isDeleteRoleById = async (body: RoleData): Promise<any> => {
  const response = await HttpClient.post(`/permissions/role/selectDelete/${body._id}`, body);

  return response;
};

export const DeleteRoleById = async (roleId: string): Promise<any> => {
  const response = await HttpClient.delete(`/permissions/role/delete/${roleId}`);

  return response;
};
