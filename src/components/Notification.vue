<script setup lang="ts">
import { useNotificationStore } from "@/stores/notification.store";

const notification = useNotificationStore();
</script>

<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    :timeout="notification.timeout"
    location="top right"
  >
    {{ notification.message }}

    <template #actions>
      <v-btn variant="text" @click="notification.close"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
