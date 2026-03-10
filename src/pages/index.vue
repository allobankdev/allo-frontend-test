<template>
  <div class="page-shell">
    <v-container class="py-8 py-md-12">
      <section class="hero mb-8 mb-md-10">
        <div>
          <p class="text-overline text-primary font-weight-bold mb-3">
            Allo Bank Frontend Assignment
          </p>
          <h1 class="text-h3 text-md-h2 font-weight-bold hero-title">
            Rockets explorer with a production-minded frontend structure.
          </h1>
          <p class="text-body-1 text-medium-emphasis mt-4 hero-copy">
            Browse SpaceX rockets, filter the catalog, inspect the details, and create local rocket drafts to
            demonstrate CRUD thinking on top of a read-only API.
          </p>
        </div>

        <div class="hero-actions">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            @click="isAddDialogOpen = true"
          >
            Add Rocket
          </v-btn>

          <v-btn
            variant="text"
            prepend-icon="mdi-refresh"
            size="large"
            :loading="state.status === 'loading'"
            @click="loadRockets(true)"
          >
            Refresh Data
          </v-btn>
        </div>
      </section>

      <v-row class="mb-6">
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            rounded="xl"
            variant="flat"
            class="stat-card"
          >
            <v-card-text class="pa-5">
              <p class="text-overline text-medium-emphasis mb-2">
                Total Rockets
              </p>
              <div class="text-h4 font-weight-bold">
                {{ rockets.length }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-card
            rounded="xl"
            variant="flat"
            class="stat-card"
          >
            <v-card-text class="pa-5">
              <p class="text-overline text-medium-emphasis mb-2">
                Active Rockets
              </p>
              <div class="text-h4 font-weight-bold">
                {{ activeCount }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-card
            rounded="xl"
            variant="flat"
            class="stat-card"
          >
            <v-card-text class="pa-5">
              <p class="text-overline text-medium-emphasis mb-2">
                Local Drafts
              </p>
              <div class="text-h4 font-weight-bold">
                {{ localDraftCount }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <RocketFilters v-model="filters" />

      <section class="mt-6">
        <RocketState
          v-if="state.status === 'loading' && !rockets.length"
          message="We are contacting SpaceX and preparing the latest rocket catalog."
          status="loading"
          title="Loading rockets"
        />

        <RocketState
          v-else-if="state.status === 'error' && !rockets.length"
          :message="state.errorMessage || 'Unable to load rockets right now.'"
          retry-label="Try Again"
          status="error"
          title="Request failed"
          @retry="loadRockets(true)"
        />

        <RocketState
          v-else-if="!filteredRockets.length"
          message="Try a different keyword or status to widen the result set."
          status="empty"
          title="No rockets match your filter"
        />

        <v-row v-else>
          <v-col
            v-for="rocket in filteredRockets"
            :key="rocket.id"
            cols="12"
            md="6"
            xl="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </section>

      <v-snackbar
        v-model="showSnackbar"
        color="success"
        :timeout="2500"
      >
        Local rocket draft added successfully.
      </v-snackbar>

      <RocketAddDialog
        v-model="isAddDialogOpen"
        @submit="handleAddRocket"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'

  import RocketAddDialog from '@/components/rockets/RocketAddDialog.vue'
  import RocketCard from '@/components/rockets/RocketCard.vue'
  import RocketFilters from '@/components/rockets/RocketFilters.vue'
  import RocketState from '@/components/rockets/RocketState.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { RocketDraft } from '@/types/rocket'

  type RocketFilterValue = {
    search: string
    status: 'all' | 'active' | 'inactive'
    source: 'all' | 'api' | 'local'
  }

  const { state, rockets, loadRockets, addRocket } = useRocketsStore()

  const filters = ref<RocketFilterValue>({
    search: '',
    status: 'all',
    source: 'all',
  })

  const isAddDialogOpen = ref(false)
  const showSnackbar = ref(false)

  const filteredRockets = computed(() => {
    const keyword = filters.value.search.trim().toLowerCase()

    return rockets.value.filter((rocket) => {
      const matchKeyword = !keyword
        || rocket.name.toLowerCase().includes(keyword)
        || rocket.description.toLowerCase().includes(keyword)
        || rocket.country.toLowerCase().includes(keyword)

      const matchStatus = filters.value.status === 'all'
        || (filters.value.status === 'active' && rocket.active)
        || (filters.value.status === 'inactive' && !rocket.active)

      const matchSource = filters.value.source === 'all' || rocket.source === filters.value.source

      return matchKeyword && matchStatus && matchSource
    })
  })

  const activeCount = computed(() => rockets.value.filter((rocket) => rocket.active).length)
  const localDraftCount = computed(() => rockets.value.filter((rocket) => rocket.source === 'local').length)

  function handleAddRocket(draft: RocketDraft) {
    addRocket(draft)
    showSnackbar.value = true
  }

  onMounted(() => {
    loadRockets()
  })
</script>

<style scoped>
  .page-shell {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(95, 111, 255, 0.16), transparent 28%),
      linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  }

  .hero {
    display: grid;
    gap: 24px;
    align-items: end;
  }

  .hero-title {
    max-width: 780px;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }

  .hero-copy {
    max-width: 720px;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .stat-card {
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(255, 255, 255, 0.84);
    backdrop-filter: blur(12px);
  }

  @media (min-width: 960px) {
    .hero {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .hero-actions {
      justify-content: flex-end;
    }
  }
</style>
