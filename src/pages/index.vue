<template>
  <v-container class="py-6">
    <!-- Judul & Tombol Tambah Roket -->
    <div class="d-flex flex-wrap justify-space-between align-center ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Daftar roket SpaceX dari Launch Library 2 API
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="isDialogOpen = true"
      >
        Tambah Roket
      </v-btn>
    </div>

    <!-- Kolom Filter / Pencarian -->
    <v-text-field
      v-model="store.searchKeyword"
      label="Cari nama atau deskripsi roket..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-4"
      @click:clear="store.searchKeyword = ''"
    />

    <!-- 1. State: LOADING -->
    <div v-if="store.isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="mt-4 text-medium-emphasis">Sedang memuat data roket...</p>
    </div>

    <!-- 2. State: ERROR + RETRY -->
    <v-alert
      v-else-if="store.errorMessage"
      type="error"
      variant="tonal"
      class="my-6"
    >
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <span>{{ store.errorMessage }}</span>
        <v-btn color="error" size="small" @click="store.fetchRockets()">
          Retry
        </v-btn>
      </div>
    </v-alert>

    <!-- 3. State: SUCCESS -->
    <template v-else>
      <v-alert
        v-if="store.filteredRockets.length === 0"
        type="info"
        variant="tonal"
      >
        Roket tidak ditemukan.
      </v-alert>

      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </template>

    <!-- Popup Form Tambah Roket -->
    <v-dialog v-model="isDialogOpen" max-width="500">
      <v-card>
        <v-card-title class="font-weight-bold">Tambah Roket Baru</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleAddRocket">
            <v-text-field
              v-model="form.name"
              label="Nama Roket *"
              variant="outlined"
              required
              class="mb-2"
            />
            <v-textarea
              v-model="form.description"
              label="Deskripsi *"
              variant="outlined"
              rows="3"
              required
              class="mb-2"
            />
            <v-text-field
              v-model="form.image"
              label="URL Gambar (opsional)"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model.number="form.cost"
              label="Cost per Launch USD (opsional)"
              type="number"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="form.country"
              label="Country Code, misal: USA (opsional)"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="form.firstFlight"
              label="First Flight (opsional)"
              type="date"
              variant="outlined"
            />

            <div class="d-flex justify-end ga-2 mt-4">
              <v-btn variant="text" @click="isDialogOpen = false">Batal</v-btn>
              <v-btn color="primary" type="submit">Simpan</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRocketStore } from "@/stores/rocketStore";
import RocketCard from "@/components/RocketCard.vue";

const store = useRocketStore();
const isDialogOpen = ref(false);

const form = reactive({
  name: "",
  description: "",
  image: "",
  cost: null as number | null,
  country: "USA",
  firstFlight: "",
});

// Lifecycle: ambil data saat halaman dibuka pertama kali
onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets();
  }
});

function handleAddRocket() {
  if (!form.name.trim() || !form.description.trim()) return;

  store.addNewRocket({
    name: form.name,
    description: form.description,
    image: form.image,
    cost: form.cost,
    country: form.country || "Tidak diketahui",
    firstFlight: form.firstFlight || null,
  });

  form.name = "";
  form.description = "";
  form.image = "";
  form.cost = null;
  form.country = "USA";
  form.firstFlight = "";
  isDialogOpen.value = false;
}
</script>
