import {
  getDriversService,
  getDriverByIdService,
  createDriverService,
  updateDriverService,
  deleteDriverService,
} from "@/services/driverService";

import type {
  Driver,
  CreateDriverPayload,
  UpdateDriverPayload,
} from "@/models/driverModel";

import type { ListRequest, ListResponse } from "@/models/common/listModel";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/**
 * Lista drivers com filtros de paginação e busca
 */
export const useGetDrivers = (params: ListRequest) =>
  useQuery<ListResponse<Driver>, AxiosError>({
    queryKey: ["drivers", params],
    queryFn: () => getDriversService(params),
  });

/**
 * Busca um driver por ID
 */
export const useGetDriverById = (id: string) =>
  useQuery<Driver, AxiosError>({
    queryKey: ["driver", id],
    queryFn: () => getDriverByIdService(id),
    enabled: !!id,
  });

/**
 * Criação de driver
 */
export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation<Driver, AxiosError, CreateDriverPayload>({
    mutationFn: (payload) => createDriverService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

/**
 * Atualização de driver
 */
export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Driver,
    AxiosError,
    { id: string; payload: UpdateDriverPayload }
  >({
    mutationFn: ({ id, payload }) => updateDriverService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};

/**
 * Exclusão de driver
 */
export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id) => deleteDriverService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });
};
