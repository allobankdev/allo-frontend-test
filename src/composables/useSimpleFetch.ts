import { API_BASE_URL } from "@/config";
import {
  ref,
  type ShallowRef,
  shallowRef,
  type Ref,
  watch,
  unref,
  type MaybeRef,
} from "vue";

type SimpleFetchOptions = {
  immediate?: boolean;
};

export function useSimpleFetch<T = unknown>(
  url: MaybeRef<string>,
  options: SimpleFetchOptions = { immediate: true },
) {
  const data: ShallowRef<T | null> = shallowRef(null);
  const error: Ref<Error | null> = ref(null);
  const isLoading = ref(false);

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}${unref(url)}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      data.value = await response.json();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      isLoading.value = false;
    }
  };

  watch(
    () => unref(url),
    () => {
      fetchData();
    },
    { immediate: options.immediate },
  );

  return { data, error, isLoading, refetch: fetchData };
}
