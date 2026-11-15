<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import RocketCard from '@/components/RocketCard.vue';
import RocketForm from '@/components/RocketForm.vue';
import { useRockets } from '@/composables/useRockets';

const router = useRouter();

const {
  loading,
  error,
  searchQuery,
  filteredRockets,
  loadRockets,
  addRocket,
} = useRockets();

onMounted(loadRockets);
</script>

<template>
  <v-container class="py-8">
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
      <p class="text-body-1 text-medium-emphasis mt-2">
        Explore the rockets developed by SpaceX.
      </p>
    </div>

    <v-text-field
      v-model="searchQuery"
      label="Search rockets"
      placeholder="Enter rocket name..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-6"
      max-width="500"
    />

    <div class="mb-6">
      <RocketForm @save="addRocket" />
    </div>
    
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
      <p class="mt-4">Loading rockets...</p>
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ error }}

      <template #append>
        <v-btn
          color="error"
          variant="outlined"
          @click="loadRockets"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <div v-else-if="filteredRockets.length === 0" class="text-center py-12">
      <v-icon size="56" color="grey">mdi-rocket-outline</v-icon>
      <p class="mt-4">No rockets found.</p>
    </div>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard
          :rocket="rocket"
          @click="router.push(`/rockets/${rocket.id}`)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
