export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  cpForCNPJ?: string | null;
  registeredAt: string;
  defaultAddress?: string | null;
  additionalInfo?: string | null;
  receivesPromotions: boolean;
}

export interface CreateCustomerPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  cpForCNPJ?: string;
  defaultAddress?: string;
  additionalInfo?: string;
  receivesPromotions: boolean;
}

export interface UpdateCustomerPayload {
  id: string;
  fullName: string;
  phoneNumber: string;
  cpForCNPJ?: string;
  defaultAddress?: string;
  additionalInfo?: string;
  receivesPromotions: boolean;
}
