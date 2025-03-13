<script setup lang="ts">
import { onMounted } from "vue";
import { useRocketStore } from "@/stores/useRocketStore";
import RocketList from "@/components/RocketList.vue";
import DialogAdd from "@/components/DialogAdd.vue";

const rocketStore = useRocketStore();
onMounted(() => {
  rocketStore.fetchRockets();
});

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="justify-space-between d-flex align-center">
          <h2>SpaceX Rockets</h2>
          <div style="min-width: 300px;">
            <v-text-field
              v-model="rocketStore.searchTerm"
              density="compact"
              hide-details="auto"
              label="Search by name"
            />
          </div>
          <v-btn
            variant="outlined"
            @click="rocketStore.isCreate = true"
          >
            <v-icon>mdi-plus</v-icon>
            Add Rocket
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex justify-center">
          <p v-if="rocketStore.loading">
            <v-progress-circular
              indeterminate
            />
          </p>
          <p
            v-if="rocketStore.error"
            style="color: red"
          >
            {{ rocketStore.error }}
            <v-btn
              variant="outlined"
              @click="rocketStore.fetchRockets"
            >
              <v-icon>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="rocketStore.rockets.length && rocketStore.searchTerm.length === 0">
      <v-col
        v-for="rocket in rocketStore.rockets"
        :key="rocket.id"
        cols="12"
        md="4"
      >
        <RocketList :rocket="rocket" />
      </v-col>
    </v-row>

    <v-row v-if="rocketStore.searchTerm.length">
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        md="4"
      >
        <RocketList :rocket="rocket" />
      </v-col>
    </v-row>

    <DialogAdd />
    <!-- <v-dialog
      v-model="rocketStore.isCreate"
      width="500"
    >
      <v-card>
        <v-card-title>
          Add New Rocket
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="rocketStore.newRocket.name"
                  label="Name"
                />
                <v-textarea
                  v-model="rocketStore.newRocket.description"
                  label="Description"
                  auto-grow
                />
                <v-text-field
                  v-model="rocketStore.newRocket.cost_per_launch"
                  label="Cost per launch"
                />
                <v-text-field
                  v-model="rocketStore.newRocket.country"
                  label="Country"
                />
                <v-text-field
                  v-model="rocketStore.newRocket.first_flight"
                  label="First flight"
                />
                <v-file-input
                  label="Upload Image"
                  accept="image/*"
                  @change="rocketStore.onImageUpload"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            variant="elevated"
            color="primary"
            @click="rocketStore.createRocket"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-container>
</template>
