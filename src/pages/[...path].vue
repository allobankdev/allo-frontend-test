<template>
  <v-container class="fill-height d-flex align-center justify-center py-12">
    <div class="text-center not-found-content">
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="100"
        color="primary"
        class="mb-6"
      />

      <div class="text-overline text-primary mb-2">MISSION CONTROL</div>

      <h1 class="text-h2 font-weight-bold mb-4">404</h1>

      <h2 class="text-h5 mb-3">Page not found</h2>

      <p class="text-body-1 text-medium-emphasis mb-8">
        Looks like this rocket has drifted off course. The page you're looking
        for doesn't exist.
      </p>

      <div class="d-flex flex-wrap justify-center ga-3">
        <v-btn color="primary" prepend-icon="mdi-home" size="large" to="/">
          Back to rockets
        </v-btn>

        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          size="large"
          @click="goBack"
        >
          Go back
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>

<style scoped>
.not-found-content {
  max-width: 520px;
}

.fill-height {
  min-height: 70vh;
}
</style>
