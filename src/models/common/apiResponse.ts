/**
 * Modelo genérico para respostas de sucesso da API
 * que incluem uma mensagem e um objeto de dados.
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
}
