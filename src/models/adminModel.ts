export interface Admin {
  id: string;
  fullName: string;
  email: string;
  cpf: string;
  profilePictureUrl?: string;
  isActive: boolean;
  createdAt: string;
}
