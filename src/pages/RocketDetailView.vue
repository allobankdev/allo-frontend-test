<template>
  <v-container>
    <div
      v-if="store.status === 'idle' || store.status === 'loading'"
      class="d-flex justify-center my-8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="store.status === 'error'"
      type="error"
      class="mb-4"
    >
      <template #prepend>
        <v-icon class="pt-2">
          mdi-alert-octagon
        </v-icon>
      </template>
      {{ store.errorMessage }}
      <template #append>
        <v-btn
          variant="text"
          @click="store.loadRockets()"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Rocket found -->
    <template v-else-if="rocket">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.push({ name: 'rocket-list' })"
      >
        Back to list
      </v-btn>

      <v-img
        v-if="rocket.imageUrl"
        :src="rocket.imageUrl"
        height="300"
        cover
        class="mb-4 rounded"
      />
      <v-sheet
        v-else
        height="300"
        class="mb-4 rounded d-flex align-center justify-center"
        color="grey-lighten-2"
      >
        <span class="text-caption">No image available</span>
      </v-sheet>

      <h1 class="mb-2">
        {{ rocket.name }}
      </h1>
      <p class="mb-4">
        {{ rocket.description ?? "No description available" }}
      </p>

      <v-list>
        <v-list-item
          title="Cost per launch"
          :subtitle="formattedCost"
        />
        <v-list-item
          title="Country"
          :subtitle="rocket.country ?? 'Unknown'"
        />
        <v-list-item
          title="First flight"
          :subtitle="rocket.firstFlight ?? 'Unknown'"
        />
      </v-list>
    </template>

    <!-- Not found -->
    <v-alert
      v-else
      type="warning"
    >
      <template #prepend>
        <v-icon class="pt-2">
          mdi-alert-octagon
        </v-icon>
      </template>
      Rocket not found.
      <template #append>
        <v-btn
          variant="text"
          @click="router.push({ name: 'rocket-list' })"
        >
          Back to list
        </v-btn>
      </template>
    </v-alert>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useRocketsStore } from "@/stores/rockets";
import { onMounted } from "vue";

onMounted(() => {
  if (store.rockets.length === 0) {
    store.loadRockets();
  }
});

const props = defineProps<{ id: string }>();
const router = useRouter();
const store = useRocketsStore();

const rocket = computed(() => store.getRocketById(Number(props.id)));

const formattedCost = computed(() => {
  const cost = rocket.value?.costPerLaunch;
  if (!cost) return "Unknown";
  return `$${Number(cost).toLocaleString()}`;
});
</script>
