<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center">
      <div>
        <h1>All Rockets</h1>
        <p></p>
      </div>
      <div>
        <v-dialog
          scrollable
          transition="dialog-bottom-transition"
          max-width="800"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              color="primary"
              prepend-icon="mdi-plus"
            >
              Add Rocket
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-form ref="form">
              <v-card title="Add new rocket">
                <v-divider class="mt-3"></v-divider>

                <template #append>
                  <v-btn
                    type="button"
                    icon="mdi-close"
                    variant="text"
                    @click="isActive.value = false"
                  ></v-btn>
                </template>

                <v-card-text class="px-4" style="max-height: 100%">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Rocket Name" required></v-text-field>
                      <v-textarea label="Description" required></v-textarea>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field label="Country" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <VDateInput
                            prepend-icon=""
                            v-model="selectedDate"
                            label="Select a date"
                          />
                        </v-col>
                      </v-row>
                      <v-text-field
                        label="Cost per Launch"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <VFileUpload
                        icon="mdi-rocket"
                        title="Upload Rocket Image"
                        density="default"
                      ></VFileUpload>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-btn
                    type="submit"
                    color="primary"
                    text="save"
                    variant="flat"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </template>
        </v-dialog>
      </div>
    </div>

    <div class="py-6">
      <v-text-field
        placeholder="Search rockets by name..."
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>

      <v-row align="stretch">
        <v-col
          v-for="rocket in rockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card :to="`/${rocket.id}`" height="100%">
            <v-img
              :aspect-ratio="4 / 5"
              class="bg-surface elevation-3 fill-width"
              src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
              cover
            ></v-img>
            <v-card-item>
              <v-card-title>{{ rocket.name }}</v-card-title>
            </v-card-item>
            <v-card-text>{{ rocket.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </VContainer>
</template>

<script lang="ts" setup>
import { VRow } from "vuetify/components";
import { ref } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VFileUpload } from "vuetify/labs/VFileUpload";
const selectedDate = ref(new Date());

const rockets = [
  {
    id: 1,
    name: "Falcon 9",
    description: "A two-stage rocket designed and manufactured by SpaceX.",
  },
  {
    id: 2,
    name: "Atlas V",
    description:
      "An expendable launch system developed by Lockheed Martin and operated by United Launch Alliance.",
  },
  {
    id: 3,
    name: "Delta IV Heavy",
    description:
      "A heavy-lift launch vehicle developed by Boeing and operated by United Launch Alliance.",
  },
];
</script>
