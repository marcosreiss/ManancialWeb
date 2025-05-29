import baseApi from "./config/api";
import type { Admin, CreateAdminPayload, UpdateAdminPayload } from "@/models/adminModel";
import type { ListRequest, ListResponse } from "@/models/common/listModel";

/**
 * Lista admins com paginação.
 */
export const getAdminsService = async (
  params: ListRequest
): Promise<ListResponse<Admin>> => {
  const response = await baseApi.get<ListResponse<Admin>>("/api/admins", { params });
  return response.data;
};

/**
 * Busca um admin por ID.
 */
export const getAdminByIdService = async (id: string): Promise<Admin> => {
  const response = await baseApi.get<Admin>(`/api/admins/${id}`);
  return response.data;
};

/**
 * Cria um novo admin.
 */
export const createAdminService = async (
  payload: CreateAdminPayload
): Promise<Admin> => {
  const response = await baseApi.post<Admin>("/api/admins", payload);
  return response.data;
};

/**
 * Atualiza um admin.
 */
export const updateAdminService = async (
  id: string,
  payload: UpdateAdminPayload
): Promise<Admin> => {
  const response = await baseApi.put<Admin>(`/api/admins/${id}`, payload);
  return response.data;
};

/**
 * Remove um admin.
 */
export const deleteAdminService = async (id: string): Promise<void> => {
  await baseApi.delete(`/api/admins/${id}`);
};
