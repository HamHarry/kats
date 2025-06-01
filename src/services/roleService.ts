import axios from "axios";
import { RoleData } from "../data/permissions";

export const createRole = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role`,
    payload
  );

  return response;
};

export const getAllRoles = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role`
  );

  return response;
};

export const updatePermissionById = async (body: any): Promise<any> => {
  const response = await axios.put(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/update/${body.roleId}`,
    body.data
  );

  return response;
};

export const isDeleteRoleById = async (body: RoleData): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/permissions/role/selectDelete/${
      body._id
    }`,
    body
  );

  return response;
};
