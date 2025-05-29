export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  cpf: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface CreateAdminPayload {
  fullName: string;
  cpf: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface UpdateAdminPayload {
  id: string;
  fullName: string;
  cpf: string;
  isActive: boolean;
  phoneNumber: string;
}
