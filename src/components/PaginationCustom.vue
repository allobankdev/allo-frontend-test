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
      :disabled="page >= lastPage"
      @click="goToPage(page + 1)"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineProps<{
  lastPage: number;
  currentPage: number;
}>();

const router = useRouter();
const route = useRoute();

const page = computed(() => parseInt(route.query.page as string) || 1);

function goToPage(newPage: number) {
  router
    .push({ query: { ...route.query, page: newPage.toString() } })
    .then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
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
