// Requisição genérica de listagem paginada
export interface ListRequest {
  pageNumber: number;
  pageSize: number;
}

// Resposta genérica de listagem paginada
export interface ListResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}
