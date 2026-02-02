<template>
  <v-card
    class="rocket-card d-flex flex-column"
    :class="{ 'inactive-rocket': !rocket.active }"
    elevation="2"
    hover
    @click="navigateToDetail"
  >
    <v-img
      :src="rocketImage"
      :alt="rocket.name"
      height="250"
      cover
      class="rocket-image"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </template>

      <v-chip
        v-if="!rocket.active"
        class="ma-2"
        color="grey"
        variant="elevated"
      >
        Inactive
      </v-chip>
      <v-chip v-else class="ma-2" color="success" variant="elevated">
        Active
      </v-chip>
    </v-img>

    <v-card-title class="text-h6 pb-1">
      {{ rocket.name }}
    </v-card-title>

    <v-card-subtitle class="text-caption pb-2">
      {{ rocket.country }} • {{ rocket.company }}
    </v-card-subtitle>

    <v-card-text class="flex-grow-1 pt-0">
      <p class="rocket-description">
        {{ truncatedDescription }}
      </p>
    </v-card-text>

    <v-card-actions class="mt-auto">
      <v-btn color="primary" variant="text" @click.stop="navigateToDetail">
        View Details
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Rocket } from "@/types/rocket";

interface Props {
  rocket: Rocket;
}

const props = defineProps<Props>();
const router = useRouter();

const rocketImage = computed(() => {
  if (props.rocket.flickr_images && props.rocket.flickr_images.length > 0) {
    return props.rocket.flickr_images[0];
  }
  return "https://placehold.co/400x250?text=No+Image+Available";
});

const truncatedDescription = computed(() => {
  const maxLength = 100;
  if (props.rocket.description.length > maxLength) {
    return props.rocket.description.substring(0, maxLength) + "...";
  }
  return props.rocket.description;
});

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const navigateToDetail = () => {
  console.log(router.getRoutes());
  router.push(`/rocket-detail/${props.rocket.id}`);
};
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 100%;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.inactive-rocket {
  opacity: 0.8;
}

.rocket-description {
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 63px;
  max-height: 63px;
  line-clamp: 3;
}

.rocket-image {
  position: relative;
  flex-shrink: 0;
}
</style>
