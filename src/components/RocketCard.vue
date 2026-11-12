<template>
  <v-card
    class="d-flex flex-column h-100"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.name"
      :src="rocket.imageUrl"
    />

    <v-card-title class="text-wrap">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <p
        class="rocket-card__description"
        :class="{ 'font-italic': !rocket.description }"
      >
        {{ rocket.description ?? 'Deskripsi belum tersedia.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  /**
   * Kartu ringkas rocket untuk layar list: gambar, nama, dan deskripsi.
   * Klik kartu membuka halaman detail rocket.
   */
  import type { Rocket } from '@/types/rocket'

  defineProps<{
    /** Rocket yang ditampilkan. */
    rocket: Rocket
  }>()
</script>

<style scoped>
  /* Batasi deskripsi 3 baris agar tinggi kartu dalam satu baris grid tetap rapi. */
  .rocket-card__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
</style>
