<template>
  <v-container class="py-6">
    <h1 class="text-h4 mb-1">
      Rocket SpaceX
    </h1>
    <p class="text-medium-emphasis mb-6">
      Daftar rocket dari Launch Library 2 API.
    </p>

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
  </v-container>
</template>

<script lang="ts" setup>
  /**
   * Layar list rocket: memuat data saat halaman dipasang, menampilkan grid kartu,
   * dan menyaring rocket berdasarkan kata kunci.
   */
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rocket'

  const rocketStore = useRocketStore()
  const { filteredRockets, listError, listStatus, rockets, searchQuery } = storeToRefs(rocketStore)

  // Store melewati request jika data sudah ada, jadi kembali dari detail tidak memicu fetch ulang.
  onMounted(() => {
    rocketStore.loadRockets()
  })
</script>
