import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface Rocket {
  id: number;
  name: string;
  description: string;
  image: string;
  cost: number | null;
  country: string;
  firstFlight: string | null;
}

interface ApiRocketItem {
  id: number;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: number | null;
  maiden_flight: string | null;
  manufacturer: {
    country_code: string | null;
  } | null;
}

export const useRocketStore = defineStore("rocketStore", () => {
  // State utama
  const rockets = ref<Rocket[]>([]);
  const selectedRocket = ref<Rocket | null>(null);
  const searchKeyword = ref<string | null>('')

  // State untuk UI (Loading & Error)
  const isLoading = ref(false);
  const errorMessage = ref("");

  // Filter otomatis sesuai ketikan user
  const filteredRockets = computed(() => {
    const keyword = (searchKeyword.value || '').toLowerCase()
    return rockets.value.filter(
      item =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    )
  })

  // 1. Ambil semua daftar roket SpaceX
  async function fetchRockets() {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(
        "https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20",
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil daftar roket dari server.");
      }

      const data: { results: ApiRocketItem[] } = await response.json();

      rockets.value = data.results.map((item) => ({
        id: item.id,
        name: item.full_name || "Nama Tidak Tersedia",
        description: item.description || "Deskripsi tidak tersedia.",
        image: item.image_url || "",
        cost: item.launch_cost ?? null,
        country: item.manufacturer?.country_code || "Tidak diketahui",
        firstFlight: item.maiden_flight || null,
      }));
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Terjadi kesalahan koneksi.";
    } finally {
      isLoading.value = false;
    }
  }

  // 2. Ambil detail 1 roket berdasarkan ID
  async function fetchRocketDetail(id: number) {
    isLoading.value = true;
    errorMessage.value = "";
    selectedRocket.value = null;

    // Cek dulu di memori (supaya roket baru buatan user bisa dibuka detailnya)
    const localFound = rockets.value.find((item) => item.id === id);
    if (localFound) {
      selectedRocket.value = localFound;
      isLoading.value = false;
      return;
    }

    try {
      const response = await fetch(
        `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/`,
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil detail roket.");
      }

      const item: ApiRocketItem = await response.json();
      selectedRocket.value = {
        id: item.id,
        name: item.full_name || "Nama Tidak Tersedia",
        description: item.description || "Deskripsi tidak tersedia.",
        image: item.image_url || "",
        cost: item.launch_cost ?? null,
        country: item.manufacturer?.country_code || "Tidak diketahui",
        firstFlight: item.maiden_flight || null,
      };
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Terjadi kesalahan koneksi.";
    } finally {
      isLoading.value = false;
    }
  }

  // 3. Tambah roket baru secara lokal (in-memory)
  function addNewRocket(newRocketData: Omit<Rocket, "id">) {
    rockets.value.unshift({
      id: Date.now(),
      ...newRocketData,
    });
  }

  return {
    rockets,
    selectedRocket,
    searchKeyword,
    isLoading,
    errorMessage,
    filteredRockets,
    fetchRockets,
    fetchRocketDetail,
    addNewRocket,
  };
});
