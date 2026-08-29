<template>
  <v-card
    :to="to"
    :link="Boolean(to)"
    rounded="lg"
    variant="outlined"
    class="h-100 d-flex flex-column"
  >
    <v-img
      :src="imageSrc"
      aspect-ratio="16/9"
      cover
      loading="lazy"
      @error="onImageError"
    >
      <template #placeholder>
        <v-skeleton-loader type="image" />
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="d-flex align-center ga-2">
        <span class="text-truncate">{{ rocket.name }}</span>

        <v-chip
          v-if="rocket.source === 'local'"
          size="x-small"
          variant="tonal"
          color="primary"
          label
        >
          LOCAL
        </v-chip>

        <v-chip
          v-if="typeof rocket.active === 'boolean'"
          size="x-small"
          :color="rocket.active ? 'success' : 'warning'"
          variant="tonal"
          label
        >
          {{ rocket.active ? "ACTIVE" : "INACTIVE" }}
        </v-chip>
      </v-card-title>

      <v-card-subtitle class="text-truncate">
        {{ rocket.country }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-body-2 flex-grow-1">
      <div class="clamp-3">
        {{ rocket.description }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import type { PropType } from "vue";
import type { Rocket } from "@/types/rocket";

const placeholderImageUrl = new URL(
  "../assets/rocket-error.jpg",
  import.meta.url
).toString();

export default defineComponent({
  name: "RocketCard",
  props: {
    rocket: {
      type: Object as PropType<Rocket>,
      required: true,
    },
    to: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const imageFailed = ref(false);

    watch(
      () => props.rocket.id,
      () => {
        imageFailed.value = false;
      }
    );

    const imageSrc = computed(() => {
      if (imageFailed.value) return placeholderImageUrl;
      const first = props.rocket.flickr_images?.[0];
      return first || placeholderImageUrl;
    });

    function onImageError() {
      imageFailed.value = true;
    }

    return { imageSrc, onImageError };
  },
});
</script>

<style scoped>
.clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
