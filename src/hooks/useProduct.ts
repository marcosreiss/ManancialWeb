import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "@/services/productService";

import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/models/productModel";

import type { ListRequest, ListResponse } from "@/models/common/listModel";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/**
 * Lista produtos com filtros de paginação e busca.
 */
export const useGetProducts = (params: ListRequest) =>
  useQuery<ListResponse<Product>, AxiosError>({
    queryKey: ["products", params],
    queryFn: () => getProductsService(params),
  });

/**
 * Busca um produto por ID.
 */
export const useGetProductById = (id: string) =>
  useQuery<Product, AxiosError>({
    queryKey: ["product", id],
    queryFn: () => getProductByIdService(id),
    enabled: !!id,
  });

/**
 * Criação de produto (com imagem via multipart/form-data).
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, AxiosError, CreateProductPayload>({
    mutationFn: (payload) => createProductService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

/**
 * Atualização de produto (com ou sem nova imagem).
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Product,
    AxiosError,
    { id: string; payload: UpdateProductPayload }
  >({
    mutationFn: ({ id, payload }) => updateProductService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

/**
 * Exclusão de produto.
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, AxiosError, string>({
    mutationFn: (id) => deleteProductService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
