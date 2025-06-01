export interface Product {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  productPictureUrl?: string | null;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  isActive: boolean;
  imageFile?: File | null;
}

export interface UpdateProductPayload {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  imageFile?: File | null;
}
