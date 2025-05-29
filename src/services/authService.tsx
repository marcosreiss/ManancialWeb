import type { LoginPayload, LoginResponse } from "@/models/authModel";
import baseApi from "./config/api";




export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await baseApi.post<LoginResponse>("/api/auth/login", payload);
    return response.data;
}