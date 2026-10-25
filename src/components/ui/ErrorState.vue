<template>
  <div class="error-wrapper">
    <div class="error-icon-wrap mb-4">
      <v-icon color="error" size="56">mdi-wifi-alert</v-icon>
    </div>

    <h3 class="text-h6 font-weight-bold text-white mb-2">Gagal Memuat Data</h3>
    <p class="text-body-2 text-medium-emphasis mb-6 error-msg">{{ message }}</p>

    <v-btn
      color="primary"
      variant="elevated"
      prepend-icon="mdi-refresh"
      size="large"
      class="retry-btn"
      @click="$emit('retry')"
    >
      Coba Lagi
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ message?: string }>()
defineEmits<{ retry: [] }>()
</script>

<style scoped>
.error-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.error-icon-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shake 0.5s ease 0.3s both;
}

.error-msg {
  max-width: 420px;
}

.retry-btn {
  background: linear-gradient(135deg, #4F8EF7, #22D3EE) !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-6deg); }
  75%       { transform: rotate(6deg); }
}
</style>
