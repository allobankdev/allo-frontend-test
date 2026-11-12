<script lang="ts" setup>
import RocketList from "@/components/RocketList.vue";
import { useRocket } from "@/stores/rocket";
import { ref } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VFileUpload } from "vuetify/labs/VFileUpload";
const selectedDate = ref(new Date());

const rocketStore = useRocket();
</script>

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
      <v-skeleton-loader
        :loading="rocketStore.isLoadingRockets"
        class="bg-transparent skeleton-search"
        type="chip"
      >
        <v-text-field
          v-if="!rocketStore.isFetchRocketFailed"
          placeholder="Search rockets by name..."
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-skeleton-loader>
      <RocketList></RocketList>
    </div>
  </VContainer>
</template>

<style scoped>
.skeleton-search :deep(.v-skeleton-loader__bone) {
  margin: 1rem 0;
  height: 50px;
  border-radius: 2.5px !important;
  max-width: 100% !important;
}
</style>
