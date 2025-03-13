<script setup lang="ts">
import { useRocketStore } from "@/stores/useRocketStore";
const rocketStore = useRocketStore();
</script>

<template>
  <v-dialog
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
                type="number"
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
  </v-dialog>
</template>