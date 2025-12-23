<template>
  <v-container class="py-8">
    <div
      class="d-flex flex-column flex-sm-row justify-space-between align-center mb-6"
    >
      <div>
        <h1 class="text-h3 font-weight-bold primary-gradient-text mb-2">
          SpaceX Explorer
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Discover humanity's future in space
        </p>
      </div>
      <div class="d-flex align-center mt-4 mt-sm-0 w-100 w-sm-auto">
        <RocketFilter v-model="search" />
        <RocketAddDialog />
      </div>
    </div>

    <v-fade-transition mode="out-in">
      <div
        v-if="store.error"
        key="error"
        class="fill-height d-flex align-center justify-center"
      >
        <AppError :message="store.error" @retry="store.fetchRockets" />
      </div>

      <div v-else-if="store.loading" key="loading">
        <v-row>
          <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader
              type="card, article"
              elevation="2"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </div>

      <div
        v-else-if="filteredRockets.length === 0"
        key="empty"
        class="text-center py-12"
      >
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="64"
          color="medium-emphasis"
          class="mb-4"
        ></v-icon>
        <h3 class="text-h6 text-medium-emphasis">
          No rockets found matching your search.
        </h3>
      </div>

      <div v-else key="content">
        <v-row>
          <v-col
            v-for="rocket in filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card-item class="pa-0 h-100">
              <RocketCard :rocket="rocket" class="h-100" />
            </v-card-item>
          </v-col>
        </v-row>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRocketStore } from "@/stores/rocket";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import RocketAddDialog from "@/components/RocketAddDialog.vue";
import AppError from "@/components/AppError.vue";

const store = useRocketStore();
const search = ref("");

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets();
  }
});

const filteredRockets = computed(() => {
  if (!search.value) return store.rockets;
  const term = search.value.toLowerCase();
  return store.rockets.filter(
    (r) =>
      r.name.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
  );
});
</script>

<style scoped>
.primary-gradient-text {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), #ff4081);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
