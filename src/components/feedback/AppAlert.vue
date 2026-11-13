<script setup lang="ts">
type AlertType = "success" | "info" | "warning" | "error";

interface Props {
  type?: AlertType;
  // eslint-disable-next-line vue/require-default-prop
  title?: string;
  // eslint-disable-next-line vue/require-default-prop
  message?: string;
  retry?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: "info",
  retry: false,
});

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <v-alert
    :type="type"
    variant="tonal"
    class="mb-6"
    :title="title"
  >
    <div class="d-flex align-center justify-space-between ga-4">
      <span>{{ message }}</span>

      <v-btn 
        v-if="retry"
        :color="type"
        variant="flat"
        @click="emit('retry')"
      >
        Retry 
      </v-btn>
    </div>
  </v-alert>
</template>
