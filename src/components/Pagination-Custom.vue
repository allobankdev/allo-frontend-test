<template>
  <div class="simple-pagination">
    <v-btn
      icon
      variant="text"
      size="small"
      :disabled="page <= 1"
      @click="goToPage(page - 1)"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <div class="page-indicator text-white">
      Page {{ currentPage }} of {{ lastPage }}
    </div>

    <v-btn
      icon
      variant="text"
      size="small"
      @click="goToPage(page + 1)"
      :disabled="page >= lastPage"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import apiInstance from "@/utils/api";
import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const page = computed(() => parseInt(route.query.page as string) || 1);
const limit = computed(() => parseInt(route.query.limit as string) || 4);
const lastPage = ref(1);
const currentPage = ref(1);
function goToPage(newPage: number) {
  router.push({ query: { ...route.query, page: newPage.toString() } });
}

watchEffect(async () => {
  const { data } = await apiInstance.post("/v4/crew/query", {
    query: {},
    options: {
      limit: limit.value,
      page: page.value,
    },
  });
  lastPage.value = data.totalPages;
  currentPage.value = data.page;
});
</script>

<style scoped>
.simple-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.page-indicator {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  min-width: 100px;
  text-align: center;
}

.v-btn {
  width: 36px;
  height: 36px;
}
</style>
