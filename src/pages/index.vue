<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRocketStore } from '../stores/rocketStore'
  import RocketCard from '../components/RocketCard.vue'
  import AddRocketForm from '../components/AddRocketForm.vue'

  const store = useRocketStore()
  const router = useRouter()

  const searchQuery = ref('')
  const showAddForm = ref(false)

  onMounted(() => {
    store.fetchRockets()
  })

  const filteredRockets = computed(() => {
    if (!searchQuery.value) {
      return store.allRockets
    }

    const query = searchQuery.value.toLowerCase()

    return store.allRockets.filter((rocket) =>
      (rocket.full_name?.toLowerCase().includes(query) || false) ||
      (rocket.description?.toLowerCase().includes(query) || false)
    )
  })

  function goToDetail(id: string | number) {
    router.push(`/rocket/${id}`)
  }
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">
      SpaceX Rockets
    </h1>

    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="searchQuery"
          label="Cari roket"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        class="text-sm-right"
      >
        <v-btn
          color="primary"
          @click="showAddForm = true"
        >
          <v-icon start>
            mdi-plus
          </v-icon>
          Tambah Roket
        </v-btn>
      </v-col>
    </v-row>

    <AddRocketForm v-model="showAddForm" />

    <div
      v-if="store.loading"
      class="text-center py-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
      <p class="mt-2">
        Memuat data...
      </p>
    </div>

    <v-alert
      v-else-if="store.error"
      type="error"
      variant="tonal"
      class="mt-4"
    >
      {{ store.error }}
      <template #append>
        <v-btn
          color="error"
          @click="store.fetchRockets()"
        >
          Coba Lagi
        </v-btn>
      </template>
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard
          :rocket="rocket"
          @click="goToDetail(rocket.id)"
        />
      </v-col>
    </v-row>

    <p
      v-if="!store.loading && !store.error && filteredRockets.length === 0"
      class="text-center mt-8"
    >
      Roket tidak ditemukan.
    </p>
  </v-container>
</template>
