// hooks/useAdmin.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAdminsService,
  getAdminByIdService,
  updateAdminService,
  deleteAdminService,
} from "@/services/adminService";
import type { Admin } from "@/models/adminModel";
import type { AxiosError } from "axios";

// Lista todos os admins
export const useAdmins = () => {
  return useQuery<Admin[], AxiosError>({
    queryKey: ["admins"],
    queryFn: getAdminsService,
  });
};

// Busca um admin específico
export const useAdminById = (id: string) => {
  return useQuery<Admin, AxiosError>({
    queryKey: ["admin", id],
    queryFn: () => getAdminByIdService(id),
    enabled: !!id,
  });
};

// Atualiza um admin
export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<Admin, AxiosError, { id: string; payload: Partial<Admin> }>({
    mutationFn: ({ id, payload }) => updateAdminService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// Deleta um admin
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: deleteAdminService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
