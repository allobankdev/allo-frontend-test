import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { fetchRocket, fetchRockets } from "@/services/rockets";
import type { NewRocket, Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", () => {
  const apiRockets = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>([]);
  const details = ref<Record<string, Rocket>>(Object.create(null));
  const filter = ref("");
  const listLoaded = ref(false);
  const listLoading = ref(false);
  const listError = ref<string | null>(null);
  const detailLoading = ref<Record<string, boolean>>(Object.create(null));
  const detailErrors = ref<Record<string, string | null>>(Object.create(null));
  let pendingList: Promise<void> | undefined;
  const pendingDetails = new Map<string, Promise<void>>();

  const rockets = computed(() => [...localRockets.value, ...apiRockets.value]);
  const filteredRockets = computed(() => {
    const query = filter.value.trim().toLocaleLowerCase();
    return rockets.value.filter((rocket) =>
      `${rocket.name ?? ""}\n${rocket.description ?? ""}`
        .toLocaleLowerCase()
        .includes(query),
    );
  });

  function setFilter(value: string | null) {
    filter.value = value ?? "";
  }

  function getRocket(id: string): Rocket | undefined {
    return (
      rockets.value.find((rocket) => rocket.id === id) ?? details.value[id]
    );
  }

  function loadList(force = false): Promise<void> {
    if (pendingList) return pendingList;
    if (listLoaded.value && !force) return Promise.resolve();
    listLoading.value = true;
    listError.value = null;
    pendingList = (async () => {
      try {
        apiRockets.value = await fetchRockets();
        for (const rocket of apiRockets.value)
          details.value[rocket.id] = rocket;
        listLoaded.value = true;
      } catch (error) {
        listError.value =
          error instanceof Error
            ? error.message
            : "Gagal memuat daftar rocket.";
      } finally {
        listLoading.value = false;
        pendingList = undefined;
      }
    })();
    return pendingList;
  }

  function loadDetail(id: string): Promise<void> {
    if (getRocket(id)) return Promise.resolve();
    const pending = pendingDetails.get(id);
    if (pending) return pending;
    detailErrors.value[id] = null;
    if (id.startsWith("local-")) {
      detailErrors.value[id] =
        "Rocket lokal tidak tersedia. Data lokal hanya tersimpan selama sesi aplikasi ini.";
      return Promise.resolve();
    }
    if (!/^[1-9]\d*$/.test(id)) {
      detailErrors.value[id] = "ID rocket tidak valid.";
      return Promise.resolve();
    }
    detailLoading.value[id] = true;
    const task = (async () => {
      try {
        details.value[id] = await fetchRocket(id);
      } catch (error) {
        detailErrors.value[id] =
          error instanceof Error
            ? error.message
            : "Gagal memuat detail rocket.";
      } finally {
        detailLoading.value[id] = false;
        pendingDetails.delete(id);
      }
    })();
    pendingDetails.set(id, task);
    return task;
  }

  function addRocket(input: NewRocket): Rocket {
    const name = input.name?.trim();
    const description = input.description?.trim();
    if (!name || !description)
      throw new Error("Nama dan deskripsi wajib diisi.");
    const rocket: Rocket = {
      ...input,
      name,
      description,
      id: `local-${crypto.randomUUID()}`,
      source: "local",
    };
    localRockets.value.unshift(rocket);
    setFilter("");
    return rocket;
  }

  return {
    apiRockets,
    localRockets,
    details,
    rockets,
    filteredRockets,
    filter,
    listLoaded,
    listLoading,
    listError,
    detailLoading,
    detailErrors,
    setFilter,
    getRocket,
    loadList,
    loadDetail,
    addRocket,
    retryList: () => loadList(true),
    retryDetail: (id: string) => loadDetail(id),
  };
});
