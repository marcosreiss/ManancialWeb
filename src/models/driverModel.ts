export type PixKeyType = "CPF" | "CNPJ" | "Email" | "Phone" | "Random"; // Enum do backend

export interface Driver {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;

  cpf?: string | null;
  cnhNumber?: string | null;
  licenseExpiration: string; // ISO date

  vehiclePlate?: string | null;
  vehicleType?: string | null;
  vehicleModel?: string | null;
  vehicleColor?: string | null;
  dumpsterSizeInCubicMeters?: number | null;

  registeredAt: string; // ISO date
  isAvailable: boolean;

  pixKey?: string | null;
  pixKeyType?: PixKeyType | null;

  creditBalance?: number | null;
}
export interface CreateDriverPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;

  cpf?: string;
  cnhNumber?: string;
  licenseExpiration: string;

  vehiclePlate?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  dumpsterSizeInCubicMeters?: number;

  isAvailable: boolean;

  pixKey?: string;
  pixKeyType?: PixKeyType;
}
export interface UpdateDriverPayload {
  id: string;
  fullName: string;
  phoneNumber: string;

  cpf?: string;
  cnhNumber?: string;
  licenseExpiration: string;

  vehiclePlate?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  dumpsterSizeInCubicMeters?: number;

  isAvailable: boolean;

  pixKey?: string;
  pixKeyType?: PixKeyType;
}
