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
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
          />

          <v-select
            v-model="categoryInput"
            :items="filterItems"
            :label="filterLabel"
            variant="outlined"
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
                  variant="outlined"
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
import { ref, watch, computed } from "vue";
import { useRoute, useRouter, type LocationQueryRaw } from "vue-router";

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
    default: "/rockets",
  },
});

const route = useRoute();
const router = useRouter();

const titleInput = ref((route.query.name as string) || "");

const getInitialCategoryValue = () => {
  if (props.filterType === "status") {
    const activeQuery = route.query.active as string;
    return activeQuery || "";
  } else {
    return (route.query.agency as string) || "";
  }
};
const categoryInput = ref(getInitialCategoryValue());

const filterItems = computed(() => {
  if (props.filterType === "status") {
    return [
      { title: "All", value: "" },
      { title: "Active", value: "true" },
      { title: "Inactive", value: "false" },
    ];
  } else {
    return [
      { title: "All", value: "" },
      { title: "NASA", value: "NASA" },
      { title: "ESA", value: "ESA" },
      { title: "JAXA", value: "JAXA" },
      { title: "SpaceX", value: "SpaceX" },
    ];
  }
});

const handleForm = () => {
  const query: LocationQueryRaw = {
    ...route.query,
    name: titleInput.value as string,
  };

  if (props.filterType === "status") {
    query.active = categoryInput.value || undefined;
  } else {
    query.agency = categoryInput.value || undefined;
  }

  router.push({ query });
};

watch(
  () => route.query,
  (newQuery) => {
    titleInput.value = (newQuery.name as string) || "";
    if (props.filterType === "status") {
      categoryInput.value = (newQuery.active as string) || "";
    } else {
      categoryInput.value = (newQuery.agency as string) || "";
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
