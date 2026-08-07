<template>
  <v-container>
    <!-- Placeholder detail screen -->
    <v-row>
      <v-col>
        <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()" class="mb-4" />
        <h1 class="text-h4 mb-4">Rocket Detail: {{ route.params.id }}</h1>
        <p>Detailed info will appear here.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

// Catch route params
const route = useRoute()
</script>
