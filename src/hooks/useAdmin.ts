import {
  getAdminsService,
  getAdminByIdService,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from "@/services/adminService";

import type {
  Admin,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "@/models/adminModel";

import type { ListRequest, ListResponse } from "@/models/common/listModel";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/**
 * Lista admins com filtros de paginação
 */
export const useGetAdmins = (params: ListRequest) =>
  useQuery<ListResponse<Admin>, AxiosError>({
    queryKey: ["admins", params],
    queryFn: () => getAdminsService(params),
  });

/**
 * Busca um admin por ID
 */
export const useGetAdminById = (id: string) =>
  useQuery<Admin, AxiosError>({
    queryKey: ["admin", id],
    queryFn: () => getAdminByIdService(id),
    enabled: !!id,
  });

/**
 * Criação de admin
 */
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<Admin, AxiosError, CreateAdminPayload>({
    mutationFn: (payload) => createAdminService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

/**
 * Atualização de admin
 */
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<Admin, AxiosError, { id: string; payload: UpdateAdminPayload }>({
    mutationFn: ({ id, payload }) => updateAdminService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

/**
 * Exclusão de admin
 */
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id) => deleteAdminService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
