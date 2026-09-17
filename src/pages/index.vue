<template>
  <section class="flex flex-col gap-6">
    <PageHeader
      subtitle="Browse, filter, and add SpaceX launch vehicles."
      title="Rockets"
    >
      <button
        class="btn btn-primary"
        type="button"
        @click="ui.rocketFormOpen = true"
      >
        <i class="mdi mdi-plus text-base" />
        Add Rocket
      </button>
      <button
        class="btn btn-outline"
        :disabled="store.listStatus === 'loading'"
        type="button"
        @click="store.loadRockets"
      >
        Refresh Data
      </button>
    </PageHeader>

    <AsyncState
      :error="store.listError"
      loading-text="Loading rockets..."
      :status="store.listStatus"
      @retry="store.loadRockets"
    >
      <div class="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          highlighted
          hint="SpaceX launch vehicles"
          icon="mdi-rocket-launch"
          label="Total Rockets"
          :selected="store.filters.active === 'all'"
          selectable
          :value="store.counts.all"
          @select="store.filters.active = 'all'"
        />
        <StatCard
          hint="Currently in service"
          icon="mdi-check"
          label="Active Rockets"
          :selected="store.filters.active === 'active'"
          selectable
          :value="store.counts.active"
          @select="store.filters.active = 'active'"
        />
        <StatCard
          hint="No longer flying"
          icon="mdi-history"
          label="Retired Rockets"
          :selected="store.filters.active === 'retired'"
          selectable
          :value="store.counts.retired"
          @select="store.filters.active = 'retired'"
        />
        <StatCard
          hint="Added this session"
          icon="mdi-plus"
          label="Your Rockets"
          :value="store.counts.local"
        />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">
            Rocket List
          </h2>
          <p class="text-sm text-muted">
            Showing {{ store.filteredRockets.length }} of {{ store.counts.all }} rockets
          </p>
        </div>
        <RocketFilterBar
          v-model:active="store.filters.active"
          :counts="store.counts"
        />
      </div>

      <div
        v-if="store.filteredRockets.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
      >
        <RocketCard
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          :rocket="rocket"
        />
      </div>

      <div
        v-else
        class="card flex flex-col items-center gap-4 py-16 text-center"
      >
        <span class="flex size-14 items-center justify-center rounded-full bg-canvas text-3xl text-muted">
          <i class="mdi mdi-magnify-close" />
        </span>
        <div>
          <p class="font-semibold">
            No rockets found
          </p>
          <p class="mt-1 text-sm text-muted">
            Try a different keyword or status.
          </p>
        </div>
        <button
          class="btn btn-outline"
          type="button"
          @click="store.resetFilters"
        >
          Clear filters
        </button>
      </div>
    </AsyncState>
  </section>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRocketStore } from '@/stores/rockets'
  import { useUiStore } from '@/stores/ui'

  const store = useRocketStore()
  const ui = useUiStore()

  onMounted(() => {
    if (store.listStatus !== 'success') store.loadRockets()
  })
</script>
