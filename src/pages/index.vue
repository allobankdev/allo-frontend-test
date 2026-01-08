<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import RocketCard from '@/components/RocketCard.vue'
import RocketDialog from '@/components/RocketDialog.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useRockets } from '@/hooks/rocketLocal'

const { rockets, loading, error, fetchRockets, addRocket } = useRockets()
const keyword = ref('')

const filtered = computed(() =>
  rockets.value.filter(r =>
    r.name.toLowerCase().includes(keyword.value.toLowerCase())
  )
)

onMounted(fetchRockets)
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Rocket List</h1>

    <LoadingState v-if="loading" />

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="fetchRockets"
    />

    <template v-else>
      <v-row class="mb-4">
        <v-col cols="6">
          <v-text-field
            v-model="keyword"
            label="Search rocket"
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>
        <v-col cols="6" class="text-right">
          <RocketDialog @submit="addRocket" />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="rocket in filtered"
          :key="rocket.id"
          cols="12"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
