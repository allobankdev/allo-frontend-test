
<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRocketStore } from "@/stores/Rockets";
import { useRouter } from 'vue-router';

const rocketStore = useRocketStore();
const router = useRouter();

const hover = ref(false);
const showForm = ref(false);
const loading = ref(false)
const error = ref(false)

const rocketData = computed(() => {return rocketStore.filteredRockets});

async function getAllRockets() {
  try {
    loading.value = true
    const res = await rocketStore.fetchAllRockets()
    rocketStore.$patch({ rocketData: res });
  } catch (err: any) {
    error.value = true
  } finally {
    loading.value = false
  }
}

function navigateToDetail (id: string) {
  router.push({ name: '/rocket/[id]', params: { id } });
};

function openForm() {
  showForm.value = true;
}

onMounted(() => {
  getAllRockets()
})

</script>

<template>
  <v-container
    class="page-wrapper"
    fluid
  >
    <v-row>
      <!-- Filter -->
      <v-col
        cols="12"  
        md="3" 
      >
        <Filter class="mt-4" />
      </v-col>
        
      <!-- Cards -->
      <v-col
        cols="12"
        md="9"
      >
        <div
          v-if="loading"
          class="d-flex flex-column align-center justify-center py-10"
        >
          <Loading text="Fetching rockets..." />
        </div>

        <!-- Error State -->
        <Error
          v-else-if="error"
          title="Failed to Load Data" 
          message="Unable to fetch rocket list at the moment." 
        />
        <v-row
          v-else-if="rocketData.length > 0"
          dense
        >
          <v-col
            v-for="rocket in rocketData"
            :key="rocket.id"
            cols="12"
            md="6"
            class="mt-4"
          >
            <Card
              :rocket="rocket"
              @click="navigateToDetail(rocket.id)"
            />
          </v-col>
        </v-row>

        <Empty
          v-else-if="rocketData.length === 0"
          title="Empty Data" 
          message="No rockets available yet."
          icon="mdi-rocket-off"
        />
      </v-col>
    </v-row>

    <!-- Floating Button -->
    <v-btn
      color="primary"
      size="large"
      class="fab"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="openForm"
    >
      <v-icon size="24">
        mdi-plus
      </v-icon>
      <span v-if="hover">Add Rocket</span>
    </v-btn>
    <v-dialog
      v-model="showForm"
      max-width="600px"
      persistent
    >
      <CreateForm @close="showForm = false" />
    </v-dialog>
  </v-container>
</template>

<style scoped>
.page-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}

@media (min-width: 960px) {
  .page-wrapper {
    padding-left: 100px;
    padding-right: 100px;
  }
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  min-width: 0;
  padding: 0;
  transition: all 0.3s ease;
}

.fab:hover {
  border-radius: 8px;
  width: auto;
  min-width: 120px;
  padding: 0 16px;
}
</style>
