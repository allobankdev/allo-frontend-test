<template>
  <div class="rocket-list-page">
    <v-container class="py-6">
      <v-row class="mb-5">
        <v-col cols="12">
         <div class="d-flex flex-row justify-space-between align-center">
            <div>
              <h1 class="text-h4 font-weight-bold">🚀 SpaceX Rocket</h1>
              <p class="text-subtitle-1 text-grey">Manage your rockets here</p>
            </div>
            <div>
              <v-btn  
                prepend-icon="mdi-plus"
                variant="outlined"
                size="large"
                class="add-rocket-btn"
                @click="showModalAdd = true">
                Add Rocket
              </v-btn>
            </div>
         </div>
        </v-col>
      </v-row>

      <div class="filter-rocket-section">
        
      </div>
      
      <div class="rocket-card-list-section">
        <v-row>
          <v-col
            v-for="rocket in rocketStore.rockets || [5]"
            :key="rocket.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <SkeleteonCard 
              v-if="rocketStore?.isLoading"
            />
            <RocketCard v-else 
              :rocket="rocket" 
            />
          </v-col>
        </v-row>
      </div>


    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRocketsStore } from '@/stores/RocketStore'
  import RocketCard from '@/components/RocketCard.vue'
  
  const rocketStore = useRocketsStore()
  const showModalAdd = ref(false);

  onMounted(async () => {
    if (rocketStore?.rockets?.length === 0) {
      await rocketStore.fetchRockets()
    }
  })

</script>

<style scoped>
  .rocket-list-page {
    min-height: 100vh;
  }
</style>
