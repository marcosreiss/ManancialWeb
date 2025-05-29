// services/adminService.ts
import baseApi from "./config/api";
import type { Admin } from "@/models/adminModel";

export const getAdminsService = async (): Promise<Admin[]> => {
  const response = await baseApi.get<Admin[]>("/api/admins");
  return response.data.map(mapAdminResponse);
};

export const getAdminByIdService = async (id: string): Promise<Admin> => {
  const response = await baseApi.get(`/api/admins/${id}`);
  return mapAdminResponse(response.data);
};

export const updateAdminService = async (id: string, payload: Partial<Admin>): Promise<Admin> => {
  const response = await baseApi.put(`/api/admins/${id}`, payload);
  return mapAdminResponse(response.data);
};

export const deleteAdminService = async (id: string): Promise<void> => {
  await baseApi.delete(`/api/admins/${id}`);
};

// Transformador de response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapAdminResponse = (data: any): Admin => ({
  id: data.id,
  fullName: data.fullName,
  email: data.applicationUser?.email ?? "",
  cpf: data.cpf,
  profilePictureUrl: data.profilePictureUrl,
  isActive: data.isActive,
  createdAt: data.createdAt,
});
