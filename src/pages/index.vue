<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <header class="mb-8">
      <h1 class="mt-1 text-4xl font-bold tracking-tight text-slate-900">
        Rocket Dashboard
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-500">
        List of rockets with their details. You can search, view, and add new rockets to the list.
      </p>
    </header>

    <RocketFilterBar
      v-model="search"
      class="mb-8"
      :visible-count="filteredRockets.length"
      @add-click="isAddDialogOpen = true"
    />

    <LoadingState v-if="store.status === 'loading'" />

    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets(true)"
    />

    <EmptyState v-else-if="filteredRockets.length === 0" />

    <div
      v-else
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="store.addRocket"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import RocketCard from '@/components/rockets/RocketCard.vue'
  import RocketFilterBar from '@/components/rockets/RocketFilterBar.vue'
  import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'
  import LoadingState from '@/components/ui/LoadingState.vue'
  import ErrorState from '@/components/ui/ErrorState.vue'
  import EmptyState from '@/components/ui/EmptyState.vue'
  import { useRocketsStore } from '@/stores/rockets'

  const store = useRocketsStore()
  const search = ref('')
  const isAddDialogOpen = ref(false)

  const filteredRockets = computed(() => {
    const term = search.value.trim().toLowerCase()
    if (!term) return store.rockets
    return store.rockets.filter(rocket =>
      rocket.full_name.toLowerCase().includes(term)
    )
  })

  onMounted(() => {
    store.fetchRockets()
  })
</script>
