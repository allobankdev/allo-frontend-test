<template>
  <div class="loading-state-wrapper py-6">
    <div class="text-center mb-8">
      <v-progress-circular
        indeterminate
        color="white"
        size="48"
        width="3"
        class="mb-4"
      />
      <h3 class="text-h6 font-weight-medium text-white mb-1">
        Memuat Data Roket SpaceX...
      </h3>
      <p class="text-caption text-grey">
        Mengambil informasi konfigurasi roket dari Launch Library 2 API
      </p>
    </div>

    <!-- Skeleton Grid -->
    <v-row>
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="skeleton-card"
          variant="outlined"
        >
          <div class="skeleton-img pulse-anim" />
          <div class="p-4">
            <div class="skeleton-line-sm pulse-anim mb-3" />
            <div class="skeleton-line-lg pulse-anim mb-2" />
            <div class="skeleton-line-md pulse-anim mb-4" />
            <div class="skeleton-line-btn pulse-anim" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.skeleton-card {
  background-color: #121214;
  border: 1px solid #27272a;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-img {
  height: 220px;
  background-color: #1c1c20;
}

.skeleton-line-sm {
  width: 40%;
  height: 14px;
  background-color: #24242a;
  border-radius: 4px;
}

.skeleton-line-lg {
  width: 80%;
  height: 20px;
  background-color: #2a2a30;
  border-radius: 4px;
}

.skeleton-line-md {
  width: 100%;
  height: 38px;
  background-color: #1f1f24;
  border-radius: 4px;
}

.skeleton-line-btn {
  width: 100%;
  height: 36px;
  background-color: #24242a;
  border-radius: 4px;
}

.pulse-anim {
  animation: pulse 1.6s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.p-4 {
  padding: 1rem;
}
</style>
