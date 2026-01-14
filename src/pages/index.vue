  <template>
    <v-container>
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold">SpaceX Rockets</h1>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            label="Filter rockets by name..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>
        <v-col cols="12" md="2" class="text-right">
          <AddRocketDialog />
        </v-col>
      </v-row>

      <v-row v-if="store.loading" justify="center" class="mt-10">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-row>

      <v-alert
        v-else-if="store.error"
        type="error"
        title="Error Loading Rockets"
        text="We couldn't retrieve the rocket data at this time."
        class="mt-4"
      >
        <template v-slot:append>
          <v-btn color="white" variant="outlined" @click="store.fetchRockets">
            Retry
          </v-btn>
        </template>
      </v-alert>

      <v-row v-else>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            class="mx-auto h-100 d-flex flex-column"
            hover
            :to="`/rocket/${rocket.id}`"
          >
            <v-img
              :src="rocket.flickr_images[0]"
              height="200px"
              cover
              class="align-end text-white"
            >
              <v-card-title class="bg-black-soft">{{ rocket.name }}</v-card-title>
            </v-img>

            <v-card-text class="flex-grow-1">
              <p class="text-truncate-3">{{ rocket.description }}</p>
            </v-card-text>

            <v-divider />
            <v-card-actions>
              <v-btn color="primary" variant="text">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-if="filteredRockets.length === 0" cols="12" class="text-center mt-10">
          <v-icon icon="mdi-rocket-off" size="64" color="grey" />
          <p class="text-h6 text-grey mt-4">No rockets match your search.</p>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRocketStore } from '@/stores/rocketStore'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'

  const store = useRocketStore()
  const searchQuery = ref('')

  // Lifecycle implementation: Fetch data on mount
  onMounted(() => {
    if (store.rockets.length === 0) {
      store.fetchRockets()
    }
  })

  // Filter Requirement: Computed property for responsive searching
  const filteredRockets = computed(() => {
    return store.rockets.filter((rocket) =>
      rocket.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  </script>

  <style scoped>
  .text-truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .bg-black-soft {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
  }
  </style>
