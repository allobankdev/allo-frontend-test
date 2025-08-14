export interface ApiResponse<T> {
  docs: T;
  totalDocs?: number;
  totalPages?: string;
  page?: string;
}

export interface queryData {
  name?:
    | {
        $regex: string;
        $options: string;
      }
    | string;
  agency?: string;
  active?: boolean | string;
  query?: string;
}
