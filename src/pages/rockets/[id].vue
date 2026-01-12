<template>
  <v-container class="py-4">
    <v-btn
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="router.back()"
    >
      Back to Rockets
    </v-btn>

    <template v-if="!rocket">
      <v-skeleton-loader
        type="card, article, article"
        class="mt-4"
      />
    </template>

    <v-card
      v-else
      class="rocket-detail"
    >
      <v-img
        :src="image"
        :alt="rocket.name"
        height="400px"
        cover
        class="rocket-image"
      >
        <v-chip
          v-if="rocket.active"
          class="ma-4"
          color="success"
          size="large"
          variant="elevated"
        >
          <v-icon start>
            mdi-check-circle
          </v-icon>
          Active
        </v-chip>
      </v-img>

      <v-card-item>
        <v-card-title class="text-h4 font-weight-bold mb-2">
          {{ rocket.name }}
        </v-card-title>
        
        <v-card-subtitle class="d-flex align-center text-h6 mb-4">
          <v-icon
            icon="mdi-map-marker"
            class="mr-1"
          />
          {{ rocket.country }}
          <v-divider
            vertical
            class="mx-4"
          />
          <v-icon
            icon="mdi-rocket"
            class="mr-1"
          />
          {{ rocket.company }}
        </v-card-subtitle>

        <v-card-text>
          <p class="text-body-1 mb-6">
            {{ rocket.description }}
          </p>
          
          <v-divider class="my-4" />
          
          <v-row class="mb-4">
            <v-col
              cols="12"
              md="6"
            >
              <v-list
                density="compact"
                class="bg-transparent"
              >
                <v-list-item>
                  <template #prepend>
                    <v-icon
                      icon="mdi-calendar"
                      class="text-primary"
                    />
                  </template>
                  <v-list-item-title>First Flight</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1 font-weight-medium">
                    {{ formatDate(rocket.first_flight) }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon
                      icon="mdi-cash"
                      class="text-primary"
                    />
                  </template>
                  <v-list-item-title>Cost per Launch</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1 font-weight-medium">
                    ${{ rocket.cost_per_launch.toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template #prepend>
                    <v-icon
                      icon="mdi-trending-up"
                      class="text-primary"
                    />
                  </template>
                  <v-list-item-title>Success Rate</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1 font-weight-medium">
                    {{ rocket.success_rate_pct }}%
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <div
                v-if="rocket.flickr_images?.length > 0"
                class="gallery-container"
              >
                <h3 class="text-h6 mb-3">
                  Gallery
                </h3>
                <v-slide-group show-arrows>
                  <v-slide-group-item
                    v-for="(img, index) in rocket.flickr_images"
                    :key="index"
                    v-slot="{ isSelected, toggle }"
                  >
                    <v-card
                      :class="['ma-2', { 'selected-image': isSelected }]"
                      width="150"
                      height="100"
                      @click="toggle"
                    >
                      <v-img
                        :src="img"
                        :alt="`${rocket.name} image ${index + 1}`"
                        cover
                        height="100%"
                        style="cursor: pointer;"
                        @click="image = img"
                      />
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          
          <div class="d-flex justify-end">
            <v-btn
              :href="rocket.wikipedia"
              target="_blank"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-wikipedia"
              size="large"
            >
              View on Wikipedia
            </v-btn>
          </div>
        </v-card-text>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRocketsStore } from '@/stores/rockets';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const store = useRocketsStore();

const rocket = computed(() => store.getRocketById(route.params.id as string));
const currentImage = ref(rocket.value?.flickr_images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image+Available');

const image = computed({
  get: () => currentImage.value,
  set: (newImage) => { currentImage.value = newImage; }
});

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
