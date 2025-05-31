import {
  getCustomersService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from "@/services/customerService";

import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/models/customerModel";

import type { ListRequest, ListResponse } from "@/models/common/listModel";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/**
 * Lista customers com filtros de paginação e busca
 */
export const useGetCustomers = (params: ListRequest) =>
  useQuery<ListResponse<Customer>, AxiosError>({
    queryKey: ["customers", params],
    queryFn: () => getCustomersService(params),
  });

/**
 * Busca um customer por ID
 */
export const useGetCustomerById = (id: string) =>
  useQuery<Customer, AxiosError>({
    queryKey: ["customer", id],
    queryFn: () => getCustomerByIdService(id),
    enabled: !!id,
  });

/**
 * Criação de customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<Customer, AxiosError, CreateCustomerPayload>({
    mutationFn: (payload) => createCustomerService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

/**
 * Atualização de customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Customer,
    AxiosError,
    { id: string; payload: UpdateCustomerPayload }
  >({
    mutationFn: ({ id, payload }) => updateCustomerService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

/**
 * Exclusão de customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id) => deleteCustomerService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
