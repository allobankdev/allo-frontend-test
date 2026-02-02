<template>
  <div class="empty-state">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-icon size="100" color="grey-lighten-1" class="mb-4">
            {{ icon }}
          </v-icon>

          <h2 class="text-h5 mb-2">{{ title }}</h2>

          <p class="text-body-1 text-grey">
            {{ message }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  title: "No Results Found",
  message: "Try adjusting your filters or search query.",
  icon: "mdi-rocket",
});
</script>

<style scoped>
.empty-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
