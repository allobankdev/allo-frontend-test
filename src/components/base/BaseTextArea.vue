<template>
  <div class="input-group">
    <label>
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      rows="3"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}>();

defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;

  label {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .required {
    color: red;
    font-size: 12px;
    line-height: 1;
  }

  textarea {
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 12px;
    border: 1px solid #ddd;
    background: #fff;
    color: #222;
    resize: vertical;
    outline: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: #bbb;
    }

    &:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }
  }
}
</style>
