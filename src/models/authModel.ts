export interface LoginPayload {
    username: string,
    password: string,
}

export interface LoginResponse {
    token: string;
}

export interface TokenModel {
    name: string;
    email: string;
    role: string;
}