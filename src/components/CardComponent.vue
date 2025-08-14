<template>
  <v-card class="custom-card" elevation="6" :style="{ height: '100%' }">
    <v-img
      :src="image"
      height="400px"
      class="custom-card__image"
      cover
      position="top"
      gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-icon size="x-large"> mdi-rocket </v-icon>
        </v-row>
      </template>
    </v-img>

    <v-card-title class="custom-card__title text-h6">
      {{ title }}
    </v-card-title>

    <v-card-text v-if="description" class="custom-card__description">
      <div class="text-truncate--2-lines">
        {{ description }}
      </div>
    </v-card-text>

    <v-spacer />

    <v-card-actions class="px-4 pb-4">
      <router-link
        :to="`${path}/${id}`"
        class="router-link"
        style="width: 100%"
      >
        <v-btn
          color="blue-darken-3"
          :prepend-icon="
            path === '/rockets' ? 'mdi-rocket-launch' : 'mdi-account'
          "
          size="large"
          class="custom-card__button"
          elevation="2"
          block
        >
          Show Details
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps({
  id: {
    type: String,
    default: crypto.randomUUID,
  },
  title: {
    type: String,
    default: "Rocket",
  },
  image: {
    type: String,
    default: "https://placehold.co/600x400",
  },
  description: {
    type: String,
    default: "Lorem Ipsum Dolor Amet",
  },
  path: {
    type: String,
    default: "/rockets",
  },
});
</script>

<style lang="scss" scoped>
.custom-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: linear-gradient(135deg, #1e1e2f, #2b2b45);
  color: #f0f0f0;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
  }

  &__image {
    object-fit: cover;
    filter: brightness(0.9);
    transition: transform 0.5s ease;
  }

  &:hover &__image {
    transform: scale(1.05);
  }

  &__title {
    font-weight: 700;
    color: #fff;
    padding: 16px 16px 8px;
    line-height: 1.3;
  }

  &__description {
    color: #cfcfcf;
    font-size: 0.95rem;
    padding: 0 16px;
    flex-grow: 1;
  }

  &__button {
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
    font-weight: 600;

    &:hover {
      background-color: #3b5998 !important;
      transform: scale(1.02);
    }
  }
}

.router-link {
  text-decoration: none;
  color: inherit;
}

.text-truncate--2-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
</style>
