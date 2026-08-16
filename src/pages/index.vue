<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="text-h4 font-weight-bold">🚀 Space Rockets</h1>
        <p class="subtitle">Explore SpaceX rockets</p>
      </div>

      <div class="actions">
        <div class="search">
          <BaseSearch v-model="store.search" placeholder="Search rocket..." />
        </div>

        <v-btn color="primary" class="add-btn" @click="showDialog = true">
          + Add Rocket
        </v-btn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="state">
      <RocketLoading text="Loading" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="state">
      <p class="mb-4">{{ store.error }}</p>
      <v-btn color="primary" @click="store.getRockets()">Retry</v-btn>
    </div>

    <!-- Empty -->
    <div v-else-if="store.filteredRockets.length === 0" class="state">
      <p class="empty-text">No rockets found 🚀</p>
    </div>

    <!-- List -->
    <v-row v-else dense>
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <!-- Dialog -->
    <RocketForm v-model="showDialog" @submit="handleAddRocket" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRocketStore } from "@/stores/rockets";
import type { Rocket } from "@/types/rocket";

const store = useRocketStore();
const showDialog = ref(false);

onMounted(() => {
  store.getRockets();
});

const handleAddRocket = (rocket: Rocket) => {
  store.addRocket(rocket);
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;

  .subtitle {
    color: #777;
    font-size: 14px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;

    .search {
      width: 320px;
      max-width: 100%;
    }

    .add-btn {
      height: 42px;
      border-radius: 10px;
      text-transform: none;
      font-weight: 500;
    }
  }
}

.state {
  text-align: center;
  padding: 80px 0;
}

.empty-text {
  color: #888;
}

/* 🔥 responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;

    .actions {
      width: 100%;
      flex-wrap: wrap;

      .search {
        width: 100%;
      }

      .add-btn {
        width: 100%;
      }
    }
  }
}
</style>
