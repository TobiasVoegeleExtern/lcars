export interface GraphQLResponse<T> {
  data: T;
  errors?: any[];
}