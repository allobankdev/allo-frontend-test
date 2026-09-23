<template>
  <v-container>
    <div class="d-flex align-center flex-wrap ga-3 mb-4">
      <h1 class="text-h5 font-weight-bold">
        Rocket
      </h1>

      <v-spacer />

      <v-text-field
        v-model="search"
        class="flex-grow-0"
        clearable
        density="compact"
        hide-details
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
        style="min-width: 320px; max-width: 560px"
      />

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="dialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <AsyncState
      :error="error"
      :status="status"
      @retry="fetchRockets"
    >
      <div
        v-if="filteredRockets.length === 0"
        class="text-center text-medium-emphasis py-12"
      >
        No rockets match your search.
      </div>

      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
          sm="6"
        >
          <RocketCard
            :rocket="rocket"
            @select="goToDetail"
          />
        </v-col>
      </v-row>
    </AsyncState>

    <RocketFormDialog
      v-model="dialog"
      @submit="addRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRockets } from '@/composables/useRockets'

  const router = useRouter()
  const { allRockets, status, error, fetchRockets, addRocket } = useRockets()

  const search = ref('')
  const dialog = ref(false)

  const filteredRockets = computed(() => {
    const term = search.value.trim().toLowerCase()
    if (!term) return allRockets.value

    return allRockets.value.filter(rocket =>
      rocket.full_name.toLowerCase().includes(term)
      || (rocket.description ?? '').toLowerCase().includes(term),
    )
  })

  function goToDetail (id: number | string) {
    router.push(`/rockets/${id}`)
  }

  onMounted(() => {
    if (status.value === 'idle') fetchRockets()
  })
</script>
