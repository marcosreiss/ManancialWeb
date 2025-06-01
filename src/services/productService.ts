import baseApi from "./config/api";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/models/productModel";
import type { ListRequest, ListResponse } from "@/models/common/listModel";
import type { ApiResponse } from "@/models/common/apiResponse";

/**
 * Lista produtos com paginação e busca.
 */
export const getProductsService = async (
  params: ListRequest
): Promise<ListResponse<Product>> => {
  const response = await baseApi.get<ListResponse<Product>>("/api/products", {
    params,
  });
  return response.data;
};

/**
 * Busca um produto por ID.
 */
export const getProductByIdService = async (id: string): Promise<Product> => {
  const response = await baseApi.get<Product>(`/api/products/${id}`);
  return response.data;
};

/**
 * Cria um novo produto com envio de imagem.
 */
export const createProductService = async (
  payload: CreateProductPayload
): Promise<Product> => {
  const formData = new FormData();
  formData.append(
    "ProductJson",
    JSON.stringify({
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
    })
  );
  if (payload.imageFile) {
    formData.append("Image", payload.imageFile);
  }

  const response = await baseApi.post<ApiResponse<Product>>("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data;
};

/**
 * Atualiza um produto com ou sem nova imagem.
 */
export const updateProductService = async (
  id: string,
  payload: UpdateProductPayload
): Promise<Product> => {
  const formData = new FormData();
  formData.append(
    "ProductJson",
    JSON.stringify({
      id: payload.id,
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
    })
  );
  if (payload.imageFile) {
    formData.append("Image", payload.imageFile);
  }

  const response = await baseApi.put<ApiResponse<Product>>(
    `/api/products/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data.data;
};

/**
 * Remove um produto por ID.
 */
export const deleteProductService = async (id: string): Promise<Product> => {
  const response = await baseApi.delete<ApiResponse<Product>>(`/api/products/${id}`);
  return response.data.data;
};
