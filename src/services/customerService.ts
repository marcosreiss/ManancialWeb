import baseApi from "./config/api";
import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/models/customerModel";
import type { ListRequest, ListResponse } from "@/models/common/listModel";

/**
 * Lista customers com paginação.
 */
export const getCustomersService = async (
  params: ListRequest
): Promise<ListResponse<Customer>> => {
  const response = await baseApi.get<ListResponse<Customer>>("/api/customers", {
    params,
  });
  return response.data;
};

/**
 * Busca um customer por ID.
 */
export const getCustomerByIdService = async (id: string): Promise<Customer> => {
  const response = await baseApi.get<Customer>(`/api/customers/${id}`);
  return response.data;
};

/**
 * Cria um novo customer.
 */
export const createCustomerService = async (
  payload: CreateCustomerPayload
): Promise<Customer> => {
  const response = await baseApi.post<Customer>("/api/customers", payload);
  return response.data;
};

/**
 * Atualiza um customer.
 */
export const updateCustomerService = async (
  id: string,
  payload: UpdateCustomerPayload
): Promise<Customer> => {
  const response = await baseApi.put<Customer>(`/api/customers/${id}`, payload);
  return response.data;
};

/**
 * Remove um customer.
 */
export const deleteCustomerService = async (id: string): Promise<void> => {
  await baseApi.delete(`/api/customers/${id}`);
};
