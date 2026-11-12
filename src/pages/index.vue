<template>
  <v-container class="py-6">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 mb-1">
          Rocket SpaceX
        </h1>
        <p class="text-medium-emphasis">
          Daftar rocket dari Launch Library 2 API.
        </p>
      </div>
      <v-btn
        color="primary"
        :disabled="listStatus !== 'success'"
        prepend-icon="mdi-plus"
        @click="isAddDialogOpen = true"
      >
        Tambah rocket
      </v-btn>
    </div>

    <AsyncState
      :error="listError"
      loading-text="Memuat daftar rocket..."
      :status="listStatus"
      @retry="rocketStore.loadRockets({ force: true })"
    >
      <v-text-field
        class="mb-2"
        clearable
        density="comfortable"
        hide-details
        label="Cari rocket"
        :model-value="searchQuery"
        placeholder="Nama atau deskripsi"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="searchQuery = $event ?? ''"
      />
      <p class="text-body-2 text-medium-emphasis mb-4">
        Menampilkan {{ filteredRockets.length }} dari {{ rockets.length }} rocket
      </p>

      <v-row v-if="filteredRockets.length">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <v-empty-state
        v-else
        icon="mdi-rocket-launch-outline"
        text="Coba kata kunci lain atau hapus filter."
        :title="`Tidak ada rocket yang cocok dengan &quot;${searchQuery}&quot;`"
      >
        <template #actions>
          <v-btn
            variant="tonal"
            @click="searchQuery = ''"
          >
            Hapus filter
          </v-btn>
        </template>
      </v-empty-state>
    </AsyncState>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="isSnackbarOpen"
      color="success"
      :timeout="4000"
    >
      Rocket "{{ addedRocket?.name }}" berhasil ditambahkan.
      <template #actions>
        <v-btn
          :to="`/rockets/${addedRocket?.id}`"
          variant="text"
        >
          Lihat
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
  /**
   * Layar list rocket: memuat data saat halaman dipasang, menampilkan grid kartu,
   * menyaring rocket berdasarkan kata kunci, dan menambah rocket baru.
   */
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { type NewRocketInput, useRocketStore } from '@/stores/rocket'
  import type { Rocket } from '@/types/rocket'

  const rocketStore = useRocketStore()
  const { filteredRockets, listError, listStatus, rockets, searchQuery } = storeToRefs(rocketStore)

  const isAddDialogOpen = ref(false)
  const isSnackbarOpen = ref(false)
  const addedRocket = ref<Rocket | null>(null)

  function handleAddRocket (input: NewRocketInput) {
    addedRocket.value = rocketStore.addRocket(input)
    // Kosongkan filter agar rocket baru (tampil paling atas) langsung terlihat.
    searchQuery.value = ''
    isSnackbarOpen.value = true
  }

  // Store melewati request jika data sudah ada, jadi kembali dari detail tidak memicu fetch ulang.
  onMounted(() => {
    rocketStore.loadRockets()
  })
</script>
