<template>
  <div class="text-center py-12 px-4">
    <v-avatar
      color="grey-darken-3"
      size="72"
      class="mb-4"
    >
      <v-icon
        icon="mdi-rocket-outline"
        size="40"
        color="grey-lighten-1"
      />
    </v-avatar>

    <h3 class="text-h6 font-weight-bold text-grey-lighten-1 mb-2">
      {{ title }}
    </h3>

    <p
      class="text-body-2 text-grey-darken-1 mb-6"
      style="max-width: 420px; margin: 0 auto;"
    >
      {{ subtitle }}
    </p>

    <v-btn
      v-if="showReset"
      color="#ffbc25"
      variant="outlined"
      prepend-icon="mdi-filter-remove-outline"
      class="rounded-lg font-weight-bold"
      @click="$emit('reset')"
    >
      Reset Filters
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    showReset?: boolean
  }>(),
  {
    title: 'No Rockets Found',
    subtitle: 'No rockets match your current filter criteria. Try adjusting your search keyword or clearing filters.',
    showReset: true,
  }
)

defineEmits<{
  (e: 'reset'): void
}>()
</script>
