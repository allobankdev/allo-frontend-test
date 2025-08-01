<template>
  <router-link :to="`/rocket/${id}`" class="router-link">
    <v-card class="custom-card" elevation="4">
      <v-img :src="image" height="200px" class="custom-card__image" />

      <v-card-title class="custom-card__title">
        {{ title }}
      </v-card-title>

      <v-card-text class="custom-card__description">
        {{ description }}
      </v-card-text>
    </v-card>
  </router-link>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.router-link {
  text-decoration: none;
  .custom-card {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }

    &__image {
      object-fit: cover;
    }

    &__title {
      font-size: 1.4rem;
      font-weight: 600;
      color: whitesmoke;
    }

    &__description {
      color: #e4dcdc;
      font-size: 1rem;
    }
  }
}
</style>
