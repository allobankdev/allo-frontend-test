<template>
  <v-card :to="`/rockets/${rocket.id}`" rounded="lg">
    <v-img 
      v-if="rocket.image"
      :src="rocket.image"
      height="160"
      cover
    />
    <div
      v-else
      class="d-flex align-center justify-center bg-surface-variant"
      style="height: 160px;"
    >
      <v-icon
        icon="mdi-rocket-launch"
        size="48"
      />
    </div>

    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-subtitle v-if="rocket.launchCost">
      Cost per launch ${{ rocket.launchCost }}
    </v-card-subtitle>

    <v-card-text>{{ rocket.description }}</v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
    import type { Rocket } from '@/types/rocket';

    defineProps<{ rocket : Rocket}>()
</script>