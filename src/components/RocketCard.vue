<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Rocket } from '../types/rocket'
import RocketImage from './RocketImage.vue'

defineProps<{ rocket: Rocket }>()
</script>

<template>
  <article class="rocket-card">
    <RouterLink class="card-link" :to="{ name: 'rocket-detail', params: { id: rocket.id } }">
      <RocketImage :src="rocket.imageUrl" :name="rocket.name" />
      <div class="card-content">
        <h2>{{ rocket.name }}</h2>
        <p>{{ rocket.description || 'Deskripsi belum tersedia.' }}</p>
        <span class="card-action">Lihat detail <span aria-hidden="true">→</span></span>
      </div>
    </RouterLink>
  </article>
</template>
