<template>
  <v-divider :class="class" />
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  class?: string
}>(), {
  class: "my-3",
})
</script>
