<template>
  <div class="rocket-detail-view">
    <v-container>
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="router.push({ name: 'home' })"
      >
        Back to Rockets
      </v-btn>
      
      <Loading v-if="loading" />
      
      <Error 
        v-else-if="error" 
        :error="error" 
        @retry="fetchRocketData" 
      />
      
      <template v-else-if="rocket">
        <v-row>
          <v-col cols="12" md="6">
            <v-carousel
              hide-delimiters
              height="400"
              show-arrows="hover"
              :continuous="false"
              v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
            >
              <v-carousel-item
                v-for="(image, i) in rocket.flickr_images"
                :key="i"
                :src="image"
                cover
              ></v-carousel-item>
            </v-carousel>
            <v-img
              v-else
              :src="rocket.flickr_images[0]"
              height="400"
              cover
            ></v-img>
          </v-col>
          
          <v-col cols="12" md="6">
            <h1 class="text-h3 mb-4">{{ rocket.name }}</h1>
            
            <v-card class="mb-4">
              <v-card-text>
                <div class="d-flex flex-column">
                  <div>
                    <div class="text-subtitle-1 font-weight-bold">Description</div>
                    <p>{{ rocket.description }}</p>
                  </div>
                  
                  <div class="d-flex flex-wrap justify-space-between">
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">Cost Per Launch</div>
                      <p>${{ formatCurrency(rocket.cost_per_launch) }}</p>
                    </div>
                    
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">Country</div>
                      <p>{{ rocket.country }}</p>
                    </div>
                    
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">First Flight</div>
                      <p>{{ formatDate(rocket.first_flight) }}</p>
                    </div>
                    
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">Status</div>
                      <v-chip
                        :color="rocket.active ? 'success' : 'error'"
                        size="small"
                      >
                        {{ rocket.active ? 'Active' : 'Inactive' }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      
      <v-alert
        v-else
        type="warning"
        text="Rocket not found"
        class="mt-4"
      ></v-alert>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRocketsStore } from '@/stores/rockets';
import { fetchRocketById } from '@/api/spacex';
import type { Rocket } from '@/types/rocket';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const route = useRoute();
const rocketStore = useRocketsStore();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
  fetchRocketData();
});

const fetchRocketData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const id = route.params.id as string;
    const cachedRocket = rocketStore.getRocketById(id);

    
    if (cachedRocket) {
      rocket.value = cachedRocket;
    } else {
      rocket.value = await fetchRocketById(props.id);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load rocket details';
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.rocket-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
</style>