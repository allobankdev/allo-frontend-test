<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="filter-container">
    <input
      type="text"
      :value="modelValue"
      placeholder="Filter rockets by name..."
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.filter-container {
  flex: 1;                 /* isi sisa space */
  max-width: 420px;        /* SEIMBANG dgn AddRocketForm */
}

input {
  width: 100%;
  height: 42px;

  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 10px;

  padding: 0 0.75rem;
  font-size: 0.9rem;
  color: #e5e7eb;
}

input::placeholder {
  color: #6b7280;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}
</style>

