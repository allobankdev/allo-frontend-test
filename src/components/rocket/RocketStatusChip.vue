<template>
  <v-chip
    :color="chip.color"
    label
    size="small"
    variant="tonal"
  >
    {{ chip.text }}
  </v-chip>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    active: boolean | null
  }>()

  const chip = computed(() => {
    if (props.active === true) return { text: 'Active', color: 'success' }
    if (props.active === false) return { text: 'Retired', color: 'grey' }
    return { text: 'Status unknown', color: 'grey' }
  })
</script>
