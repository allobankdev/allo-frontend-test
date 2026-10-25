<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>


<template>
  <div class="error-state">

    <h2>
      Failed to load data
    </h2>

    <p>
      {{ message }}
    </p>

    <button
      type="button"
      @click="$emit('retry')"
    >
      Retry
    </button>

  </div>
</template>


<style scoped>
.error-state {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.error-state h2 {
  margin-bottom: 8px;
}

.error-state p {
  margin:
    0 0 20px;

  color: #d5d4d4;
}

button {
  padding:
    12px 24px;

  border: none;

  border-radius: 8px;

  background: #111;
  color: white;

  cursor: pointer;
}
</style>