<template>
  <div class="detail-grid">
    <div class="detail-item">
      <span class="label">Cost Per Launch</span>
      <span class="value">${{ formatNumber(rocket.cost_per_launch) }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Country</span>
      <span class="value">{{ rocket.country }}</span>
    </div>
    <div class="detail-item">
      <span class="label">First Flight</span>
      <span class="value">{{ formatDate(rocket.first_flight) }}</span>
    </div>
    <div class="detail-item">
      <span class="label">Type</span>
      <span class="value">{{ rocket.type }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/stores/rocketStore'

interface Props {
  rocket: Rocket
}

defineProps<Props>()

const formatNumber = (value: number | undefined): string => {
  if (!value) return 'N/A'
  return value.toLocaleString('en-US')
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f9f9f9;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
