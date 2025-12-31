<script lang="ts">
import { ref } from "vue";
import httpRequest from "@/core/libs/httpRequest";
import { API_URL } from "@/core/libs/constans";

export interface Item {
  id: number;
  name: string;
  description: string;
  price?: number;
}

export const useApi = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = httpRequest(API_URL!);

  const request = async <T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: any
  ): Promise<T | null> => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await api[method](url, data);
      return response.data as T;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message;
      console.error("API Error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    get: <T>(url: string) => request<T>("get", url),
    post: <T>(url: string, data: any) => request<T>("post", url, data),
    put: <T>(url: string, data: any) => request<T>("put", url, data),
    delete: <T>(url: string) => request<T>("delete", url),
  };
};
</script>
