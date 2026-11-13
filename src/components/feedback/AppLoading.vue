<script setup lang="ts">
interface Props {
    color?: string
    indeterminate?: boolean
}

withDefaults(defineProps<Props>(), {
    color: 'primary', 
    indeterminate: true
})
</script>

<template>
  <v-progress-linear
    :color="color"
    :indeterminate="indeterminate"
    class="mb-6"
  />
</template>


