<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-h5">Filter Data</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleForm">
          <v-text-field
            v-model="titleInput"
            label="Cari Nama"
            placeholder="Masukkan nama..."
            clearable
            outlined
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>

          <v-select
            v-model="categoryInput"
            :items="categories"
            value
            label="Pilih Agency"
            outlined
            prepend-inner-icon="mdi-shape"
          >
            ss</v-select
          >

          <v-row class="mt-2">
            <v-col cols="6">
              <v-btn type="submit" block color="primary">Terapkan Filter</v-btn>
            </v-col>
            <v-col cols="6">
              <router-link to="/crews">
                <v-btn block color="error" outlined>Reset</v-btn>
              </router-link>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const titleInput = ref((route.query.title as string) || "");
const categoryInput = ref(route.query.categoryId as string);
const categories = ["All", "NASA", "ESA", "JAXA", "SpaceX"];

const handleForm = () => {
  router.push({
    query: {
      ...route.query,
      agency: categoryInput.value,
      name: titleInput.value,
      page: 1,
    },
  });
};
</script>

<style scoped>
/* Optional: Tambahkan styling tambahan jika diperlukan */
.v-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
