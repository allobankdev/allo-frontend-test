<template>
  <div class="pa-4 fill-screen">
    <v-sheet
      class="pa-4 mb-6 d-flex flex-wrap align-center justify-space-between gap-3"
      rounded="lg"
      elevation="1"
    >
      <div class="text-orange text-h6 font-weight-bold">Rocket List</div>

      <div class="d-flex align-center gap-3">
        <v-btn
          color="orange-darken-1"
          prepend-icon="mdi-plus"
          @click="dialogAdd = true"
        >
          Add Rocket
        </v-btn>

        <v-dialog v-model="dialogAdd" max-width="500px">
          <v-card color="grey-darken-3" theme="dark" class="rounded-xl">
            <v-card-title class="pa-6 text-h5 font-weight-bold text-orange">
              Add New Rocket
            </v-card-title>

            <v-card-text class="pa-6 pt-0">
              <v-form ref="formRef">
                <v-text-field
                  v-model="formData.name"
                  label="Rocket Name"
                  variant="outlined"
                  color="orange"
                  :rules="[rules.required, rules.min3]"
                  class="mb-2"
                />

                <v-text-field
                  v-model="formData.flickr_images"
                  label="Image URL"
                  variant="outlined"
                  color="orange"
                  :rules="[rules.url]"
                  placeholder="https://example.com/rocket.jpg"
                  class="mb-2"
                />

                <v-textarea
                  v-model="formData.description"
                  label="Description"
                  variant="outlined"
                  color="orange"
                  :rules="[rules.required]"
                  rows="3"
                  class="mb-2"
                />

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="formData.first_flight"
                      label="Launch Date"
                      type="date"
                      :rules="[rules.required]"
                      variant="outlined"
                      color="orange"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="formData.active"
                      label="Status"
                      :items="[
                        { t: 'Active', v: true },
                        { t: 'Inactive', v: false },
                      ]"
                      item-title="t"
                      item-value="v"
                      variant="outlined"
                      color="orange"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
              <v-spacer />
              <v-btn variant="text" @click="dialogAdd = false">Cancel</v-btn>
              <v-btn
                color="orange"
                variant="elevated"
                @click="saveRocket"
                class="px-6 rounded-lg"
              >
                Save Rocket
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-menu :close-on-content-click="false" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn variant="outlined" prepend-icon="mdi-filter" v-bind="props">
              Filter
            </v-btn>
          </template>

          <v-card min-width="300" class="pa-4 mt-2" rounded="lg">
            <v-text-field
              v-model="rocketStore.filters.search"
              label="Search Rocket Name"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              hide-details
              class="mb-4"
            />

            <v-select
              v-model="rocketStore.filters.active"
              :items="[
                { title: 'All Status', value: null },
                { title: 'Active', value: true },
                { title: 'Inactive', value: false },
              ]"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
            />

            <v-card-actions class="px-0 mt-2">
              <v-spacer />
              <v-btn
                variant="text"
                size="small"
                @click="rocketStore.resetFilters()"
                >Reset</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-sheet>

    <!-- Loading state -->
    <v-progress-linear
      v-if="rocketStore.loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- Rocket List -->
    <v-container>
      <v-row>
        <v-col
          v-for="rocket in rocketStore.paginatedList"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="12"
        >
          <v-card
            class="pa-4 d-flex flex-column flex-md-row align-center mb-4"
            rounded="xl"
          >
            <div class="flex-grow-1 text-center text-md-left mb-4 mb-md-0">
              <div class="text-h5 font-weight-bold">{{ rocket.name }}</div>
              <div class="text-body-2 mt-2 text-grey-lighten-1">
                {{ rocket.description }}
              </div>
              <div class="text-caption mt-2">
                First Flight: {{ rocket.first_flight }}
              </div>
              <div class="text-caption mt-1">
                Country: {{ rocket.country }}
              </div> 
            </div>

            <div class="image-wrapper ml-md-6">
              <v-img
                :src="rocket.flickr_images?.[0]"
                width="100%"
                min-width="180"
                max-width="280"
                height="160"
                cover
                class="rounded-lg"
              />
              <div class="image-overlay" @click="goToDetail(rocket.id)">
                View Detail
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Empty state -->
    <v-alert
      v-if="!rocketStore.loading && rocketStore.filteredList.length === 0"
      type="warning"
      variant="tonal"
    >
      No rocket data found.
      <u class="text-primary" @click="rocketStore.resetFilters()"
        >Reset Filter</u
      >
    </v-alert>

    <CommonPagination
      v-model="rocketStore.pagination.page"
      :length="rocketStore.totalPages"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/utils/store/rocket.store";
import CommonPagination from "@/components/Pagination.vue";

const rocketStore = useRocketStore();
const router = useRouter();

onMounted(() => {
  rocketStore.fetchList();
});

const goToDetail = (id: string) => {
  router.push(`/rockets/${id}`);
};

// create feature
const dialogAdd = ref(false);
const defaultForm = {
  name: "",
  description: "",
  first_flight: new Date().toISOString().substr(0, 10),
  active: true,
  flickr_images: "",
};

const formData = ref({ ...defaultForm });
const rules = {
  required: (value: any) => !!value || "Required.",
  min3: (value: any) => (value && value.length >= 3) || "Min 3 characters.",
  url: (value: any) => {
    if (!value) return true;
    const pattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))($|\?.*)/i;
    return (
      pattern.test(value) || "Invalid image URL (must be a valid image link)."
    );
  },
};

const formRef = ref<any>(null);

const saveRocket = async () => {
  const { valid } = await formRef.value.validate();

  if (valid) {
    rocketStore.addRocket({
      ...formData.value,
      country: 'United States', // Default 
      success_rate_pct: 100,      // Default
      height: { meters: 0 },      // Default
      mass: { kg: 0 },            // Default
      flickr_images: formData.value.flickr_images 
        ? [formData.value.flickr_images] 
        : ['https://images.unsplash.com/photo-1517976487492-5750f3195933']
    });

    dialogAdd.value = false;
    formData.value = { ...defaultForm };
  }
};
</script>

<style scoped>
.fill-screen {
  min-height: 100vh;
}

.gap-3 {
  gap: 12px;
}

.image-wrapper {
  position: relative;
  width: 180px;
  height: 120px;
  flex-shrink: 0;
}

.image-overlay {
  cursor: pointer;
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  border-radius: 12px;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
  cursor: pointer;
}

.image-wrapper {
  position: relative;
  width: 100%;
}

@media (min-width: 960px) {
  .image-wrapper {
    width: 280px;
  }
}

.text-md-left {
  padding-right: 16px;
}
</style>
