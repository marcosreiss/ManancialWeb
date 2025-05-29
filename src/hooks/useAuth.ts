import type { LoginResponse, LoginPayload } from "@/models/authModel";
import { loginService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";



/**
 * Hook para autenticação (login) do usuário
 */
export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: (payload) => loginService(payload),
    onSuccess: (data) => {
      console.log("Login efetuado com sucesso:", data);
    },
    onError: (error) => {
      console.error("Erro ao fazer login:", error);
    },
  });
};