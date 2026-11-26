<template>
  <v-container>
    <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-4">
      <h1 class="text-h4">
        SpaceX Rockets
      </h1>
      <v-btn
        v-if="listStatus === 'succeeded'"
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddDialog = true"
      >
        Add rocket
      </v-btn>
    </div>

    <StatusView
      v-if="listStatus === 'loading'"
      status="loading"
    />
    <StatusView
      v-else-if="listStatus === 'failed'"
      :message="listError"
      status="failed"
      @retry="store.loadRockets()"
    />

    <template v-else-if="listStatus === 'succeeded'">
      <RocketFilter class="mb-4" />
      <StatusView
        v-if="filteredRockets.length === 0"
        message="No rockets match your filter."
        status="empty"
      />
      <v-row v-else>
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
    </template>

    <AddRocketDialog
      v-model="showAddDialog"
      @added="showAddedToast = true"
    />
    <v-snackbar
      v-model="showAddedToast"
      timeout="2500"
    >
      Rocket added
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rocket'

  const store = useRocketStore()
  const { filteredRockets, listError, listStatus } = storeToRefs(store)

  const showAddDialog = ref(false)
  const showAddedToast = ref(false)

  // Lifecycle (mounted): fetch hanya saat belum pernah dimuat.
  // Kembali dari halaman detail tidak memicu request baru (hemat rate limit API).
  onMounted(() => {
    if (listStatus.value === 'idle') store.loadRockets()
  })
</script>
