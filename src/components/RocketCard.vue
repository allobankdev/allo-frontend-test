<script setup lang="ts">
import type { Rocket } from '@/types/rocket';

defineProps<{
  rocket: Rocket;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <v-card
    class="h-100"
    rounded="lg"
    elevation="2"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.image_url || undefined"
      height="200"
      cover
      class="bg-grey-lighten-3"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon size="64" color="grey">mdi-rocket</v-icon>
        </div>
      </template>
    </v-img>

    <v-card-title>
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text>
      {{ rocket.description || 'Deskripsi belum tersedia.' }}
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" variant="text" block>
        Lihat Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
