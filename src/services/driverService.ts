import baseApi from "./config/api";
import type {
  Driver,
  CreateDriverPayload,
  UpdateDriverPayload,
} from "@/models/driverModel";
import type { ListRequest, ListResponse } from "@/models/common/listModel";

/**
 * Lista drivers com paginação e busca.
 */
export const getDriversService = async (
  params: ListRequest
): Promise<ListResponse<Driver>> => {
  const response = await baseApi.get<ListResponse<Driver>>("/api/drivers", {
    params,
  });
  return response.data;
};

/**
 * Busca um driver por ID.
 */
export const getDriverByIdService = async (id: string): Promise<Driver> => {
  const response = await baseApi.get<Driver>(`/api/drivers/${id}`);
  return response.data;
};

/**
 * Cria um novo driver.
 */
export const createDriverService = async (
  payload: CreateDriverPayload
): Promise<Driver> => {
  const response = await baseApi.post<Driver>("/api/drivers", payload);
  return response.data;
};

/**
 * Atualiza um driver.
 */
export const updateDriverService = async (
  id: string,
  payload: UpdateDriverPayload
): Promise<Driver> => {
  const response = await baseApi.put<Driver>(`/api/drivers/${id}`, payload);
  return response.data;
};

/**
 * Remove um driver.
 */
export const deleteDriverService = async (id: string): Promise<void> => {
  await baseApi.delete(`/api/drivers/${id}`);
};
