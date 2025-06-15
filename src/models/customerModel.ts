import type { Address } from "./addressModel";

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  cpForCNPJ?: string | null;
  registeredAt: string;
  defaultAddress?: Address | null;
  additionalInfo?: string | null;
  receivesPromotions: boolean;
}

export interface CreateCustomerPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  cpForCNPJ?: string;
  defaultAddress?: Address;
  additionalInfo?: string;
  receivesPromotions: boolean;
}

export interface UpdateCustomerPayload {
  id: string;
  fullName: string;
  phoneNumber: string;
  cpForCNPJ?: string;
  defaultAddress?: Address;
  additionalInfo?: string;
  receivesPromotions: boolean;
}
