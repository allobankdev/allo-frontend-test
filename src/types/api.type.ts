export interface ApiResponse<T> {
  docs: T;
}

export interface queryData {
  name?: {
    $regex: string;
    $options: string;
  };
  agency?: string;
  active?: boolean;
}
