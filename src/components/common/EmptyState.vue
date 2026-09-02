<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col
        class="text-center"
        cols="12"
        sm="8"
        md="6"
      >
        <v-icon
          color="disabled"
          icon="mdi-rocket-outline"
          size="56"
        />
        <div class="text-h6 mt-4">
          {{ title }}
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ message }}
        </div>
        <v-btn
          v-if="actionLabel"
          class="mt-4"
          variant="tonal"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    message?: string
    actionLabel?: string
  }>(), {
    title: 'No rockets found',
    message: 'Try adjusting your search or filters.',
    actionLabel: undefined,
  })

  const emit = defineEmits<{
    action: []
  }>()
</script>
