<script setup lang="ts">
import { computed } from 'vue'
import { STATUS, type Status } from '../types/status'

const props = defineProps<{
  status: Status
  error?: string
}>()
defineEmits<{ retry: [] }>()

const isLoading = computed(() => props.status === STATUS.IDLE || props.status === STATUS.LOADING)
const isError = computed(() => props.status === STATUS.ERROR)
</script>

<template>
  <p v-if="isLoading" class="state" role="status">Loading…</p>
  <div v-else-if="isError" class="state state--error" role="alert">
    <p>Could not load the data. {{ error }}</p>
    <button type="button" class="btn" @click="$emit('retry')">Retry</button>
  </div>
  <slot v-else />
</template>
