
<template>
  <v-container>
    <h1 class="text-h4 mb-6">
      SpaceX Rockets
    </h1>

    <v-row
      align="center"
      class="mb-4"
    >
      <v-col
        cols="12"
        sm
      >
        <RocketFilter v-model="query" />
      </v-col>
      <v-col
        class="text-sm-right"
        cols="12"
        sm="auto"
      >
        <AddRocketDialog />
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="store.status === 'loading'">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <RocketCardSkeleton />
      </v-col>
    </v-row>

    <!-- Fail / Retry -->
    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.error"
      @retry="store.loadRockets"
    />

    <!-- Success -->
    <template v-else>
      <v-row v-if="filtered.length">
        <v-col
          v-for="rocket in filtered"
          :key="rocket.id"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <p
        v-else
        class="text-center text-medium-emphasis py-12"
      >
        Rocket tidak ditemukan.
      </p>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRocketStore } from '@/stores/rocketStore'

  const store = useRocketStore()
  const query = ref('')

  // Lifecycle: ambil data saat halaman dibuat (tidak fetch ulang jika sudah ada)
  onMounted(() => {
    if (store.status === 'idle') store.loadRockets()
  })

  // Filter dilakukan di client dari state, tanpa request baru ke API
  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return store.rockets.filter(r =>
      `${r.full_name} ${r.description ?? ''}`.toLowerCase().includes(q),
    )
  })
</script>