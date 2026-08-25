<template>
  <v-container class="py-10 px-6 max-width-container">
    <!-- Header Section -->
    <v-row class="mb-10 align-center" v-motion-fade-visible>
      <v-col cols="12" md="6">
        <h1 class="text-h2 font-weight-black text-gradient mb-2">SpaceX Explorer</h1>
        <p class="text-h6 text-medium-emphasis font-weight-regular">
          Discover and manage the fleet of interplanetary explorers.
        </p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-md-end gap-4 mt-4 mt-md-0">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          class="rounded-pill px-6 font-weight-bold shadow-glow"
          @click="isAddModalOpen = true"
        >
          Add Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters Section -->
    <v-row class="mb-8" v-motion-fade-visible>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="rocketStore.searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search rockets by name or description..."
          variant="outlined"
          rounded="pill"
          hide-details
          class="glass-input"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Status States -->
    <StatusState
      v-if="rocketStore.loading || rocketStore.error || rocketStore.filteredRockets.length === 0"
      :loading="rocketStore.loading"
      :error="rocketStore.error"
      :empty="rocketStore.filteredRockets.length === 0 && !rocketStore.loading && !rocketStore.error"
      @retry="rocketStore.loadRockets"
    />

    <!-- Rocket Grid -->
    <v-row v-else>
      <v-col
        v-for="(rocket, index) in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        lg="4"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 100 } }"
      >
        <RocketCard
          :rocket="rocket"
          @click="router.push(`/rockets/${rocket.id}`)"
        />
      </v-col>
    </v-row>

    <!-- Modals -->
    <AddRocketModal v-model="isAddModalOpen" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import StatusState from '@/components/StatusState.vue';
import RocketCard from '@/components/RocketCard.vue';
import AddRocketModal from '@/components/AddRocketModal.vue';

const router = useRouter();
const rocketStore = useRocketStore();
const isAddModalOpen = ref(false);

onMounted(() => {
  if (rocketStore.rockets.length === 0) {
    rocketStore.loadRockets();
  }
});
</script>

<style scoped>
.max-width-container {
  max-width: 1400px;
  margin: 0 auto;
}

.text-gradient {
  background: linear-gradient(45deg, #fff, #2196F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.glass-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.shadow-glow {
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.3);
}

.gap-4 {
  gap: 16px;
}
</style>
