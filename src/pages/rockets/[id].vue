<template>
  <div class="rocket-detail-page">
    <v-container class="py-4">
      <v-row class="mb-3">
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold">🚀 Rocket Detail</h1>
        </v-col>

        <v-btn
          class="back-button"
          prepend-icon="mdi-arrow-left"
          variant="text"
          size="large"
          @click="handleGoBack"
          >
          Back
        </v-btn>
      </v-row>

      <div v-if="rocketStore.isLoading" class="loading-container">
        <LoadingState />
      </div>

      <div v-else>
        <v-row class="mb-5">
          <v-col cols="6">
            <v-img 
              :src="rocketImage"
              :alt="rocketStore.detailRocket?.name || ''"
              height="100%"
              min-height="300"
              cover
              class="rocket-card-image rounded-lg"
            />
          </v-col>
          <v-col cols="6">
            <h5 class="text-h5 mb-3 font-weight-bold">
              {{ rocketStore.detailRocket?.name || '-' }}
            </h5>
            <p class="text-body-2 text-medium-emphasis mb-6">
              {{ rocketStore.detailRocket?.description || '-' }}
            </p>
            
            <div class="detail-spesification">
              <v-row>
                <v-col cols="6">
                  <div class="d-block text-subtitle-2 text-medium-emphasis mb-1">
                    <v-icon
                      size="small"
                      icon="mdi-earth"
                      class="mr-1"
                      /> 
                    Location
                  </div>
                  <div class="font-weight-bold text-capitalize">
                    {{ rocketStore.detailRocket?.country || '-' }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="d-block text-subtitle-2 text-medium-emphasis mb-1">
                    Status
                  </div>
                  <v-chip
                    :color="rocketStore.detailRocket?.active ? 'success' : 'error'"
                    size="small"
                    variant="elevated"
                  >
                    {{ rocketStore.detailRocket?.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </v-col>

                <v-col cols="6">
                  <div class="d-block text-subtitle-2 text-medium-emphasis mb-1">
                    <v-icon
                      size="small"
                      icon="mdi-domain"
                      class="mr-1"
                      /> 
                    Company
                  </div>
                  <div class="font-weight-bold text-capitalize">
                    {{ rocketStore.detailRocket?.company || '-' }}
                  </div>
                </v-col>
                
                <v-col cols="6">
                  <div class="d-block text-subtitle-2 text-medium-emphasis mb-1">
                    <v-icon
                      size="small"
                      icon="mdi-domain"
                      class="mr-1"
                      />  
                    Type
                  </div>
                  <div class="font-weight-bold text-capitalize">
                    {{ rocketStore.detailRocket?.type || '-' }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="d-block text-subtitle-2 text-medium-emphasis mb-1">
                    <v-icon
                      size="small"
                      icon="mdi-rocket-launch"
                      class="mr-1"
                      />  
                    First Flight
                  </div>
                  <div class="font-weight-bold text-capitalize">
                    {{ rocketStore.detailRocket?.first_flight != '' ? formatDate(rocketStore.detailRocket?.first_flight ?? '') : '-' }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="d-block text-subtitle-2 text-medium-emphasis mb-1">
                    <v-icon
                      size="small"
                      icon="mdi-rocket-launch"
                      class="mr-1"
                      />  
                    Cost Per Launch
                  </div>
                  <div class="font-weight-bold text-capitalize">
                    {{ formatCurrency(rocketStore.detailRocket?.cost_per_launch ?? 0) }}
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
      </v-row>
      </div>
    </v-container>
    
  </div>

</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { useRocketsStore } from '@/stores/rocket'
  import { useRouter, useRoute } from 'vue-router';
  import LoadingState from '@/components/LoadingState.vue'
  import { formatDate, formatCurrency } from '@/utils/formatter'

  const router = useRouter();
  const route = useRoute()
  const rocketStore = useRocketsStore()

  const rocketImage = computed(() => {
    return rocketStore.detailRocket?.flickr_images[0] || 'https://placehold.co/300x300';
   })

  onMounted(async () => {
    const id = route.params.id as string
    if (id) {
      await rocketStore.fetchRocketById(id)
    }
  })

  const handleGoBack = () => {
    router.push('/')
  }
</script>