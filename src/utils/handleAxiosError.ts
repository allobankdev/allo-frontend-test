import axios from "axios";

export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data?.message ?? `Error ${error.response.status}`;
    }

    if (error.request) {
      return "Network error. Please check your connection.";
    }

    return error.message;
  }

  return "Unexpected error occurred";
}
