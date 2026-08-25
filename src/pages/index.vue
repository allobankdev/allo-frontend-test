<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
      <h1 class="text-h5">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="isDialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <RocketFilter
      v-model="searchQuery"
      class="mb-6"
    />

    <LoadingState v-if="loading" />
    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="fetchRockets"
    />
    <template v-else>
      <v-row v-if="filteredRockets.length">
        <v-col
          v-for="(rocket, i) in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard
            :rocket="rocket"
            :index="i"
            @click="goToDetail(rocket.id)"
          />
        </v-col>
      </v-row>
      <p
        v-else
        class="text-medium-emphasis text-center py-12"
      >
        No rockets match your search.
      </p>
    </template>

    <RocketFormDialog
      v-model="isDialogOpen"
      @submit="addRocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRockets } from "@/composables/useRockets";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import RocketFormDialog from "@/components/RocketFormDialog.vue";
import LoadingState from "@/components/LoadingState.vue";
import ErrorState from "@/components/ErrorState.vue";

const router = useRouter();
const { rockets, loading, error, hasFetchedOnce, fetchRockets, addRocket } =
  useRockets();

const searchQuery = ref("");
const isDialogOpen = ref(false);

const filteredRockets = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return rockets.value;
  return rockets.value.filter((r) => {
    const name = (r.full_name || "").toLowerCase();
    const desc = (r.description || "").toLowerCase();
    return name.includes(q) || desc.includes(q);
  });
});

function goToDetail(id: number | string) {
  router.push(`/rocket/${id}`);
}

onMounted(() => {
  if (!hasFetchedOnce.value) fetchRockets();
});
</script>
