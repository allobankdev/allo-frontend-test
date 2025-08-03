<template>
  <v-container>
    <v-card
      class="pa-4"
      elevation="2"
    >
      <v-card-title class="text-h5">
        Filter Data
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleForm">
          <v-text-field
            v-model="titleInput"
            :label="searchLabel"
            :placeholder="searchPlaceholder"
            clearable
            outlined
            prepend-inner-icon="mdi-magnify"
          />

          <v-select
            v-model="categoryInput"
            :items="filterItems"
            :label="filterLabel"
            outlined
            prepend-inner-icon="mdi-shape"
          />

          <v-row class="mt-2">
            <v-col cols="6">
              <v-btn
                type="submit"
                block
                color="primary"
              >
                Terapkan Filter
              </v-btn>
            </v-col>
            <v-col cols="6">
              <router-link :to="resetRoute">
                <v-btn
                  block
                  color="error"
                  outlined
                >
                  Reset
                </v-btn>
              </router-link>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  filterType: {
    type: String,
    required: true,
    validator: (value: string) => ["status", "agency"].includes(value),
  },
  searchLabel: {
    type: String,
    default: "Cari Nama",
  },
  searchPlaceholder: {
    type: String,
    default: "Masukkan nama...",
  },
  filterLabel: {
    type: String,
    default: "Pilih Filter",
  },
  resetRoute: {
    type: String,
    default: "/crews",
  },
});

const route = useRoute();
const router = useRouter();

const titleInput = ref((route.query.name as string) || "");
const categoryInput = ref(
  (route.query[
    props.filterType === "status" ? "active" : "agency"
  ] as string) || ""
);

const filterItems =
  props.filterType === "status"
    ? ["All", "active", "non-active"]
    : ["All", "NASA", "ESA", "JAXA", "SpaceX"];

const handleForm = () => {
  const queryParam = props.filterType === "status" ? "active" : "agency";

  router.push({
    query: {
      ...route.query,
      [queryParam]:
        categoryInput.value === "All" ? undefined : categoryInput.value,
      name: titleInput.value || undefined,
      page: 1,
    },
  });
};

watch(
  () => route.query,
  (newQuery) => {
    titleInput.value = (newQuery.name as string) || "";
    categoryInput.value =
      (newQuery[
        props.filterType === "status" ? "active" : "agency"
      ] as string) || "";
  }
);
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
