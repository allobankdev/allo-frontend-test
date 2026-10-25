<template>
  <v-card
    class="h-100 d-flex flex-column"
    hover
    @click="emit('select', rocket.id)"
  >
    <v-img
      v-if="rocket.image_url"
      class="bg-grey-darken-3 flex-grow-0"
      cover
      height="200"
      :src="rocket.image_url"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon
            color="grey"
            icon="mdi-rocket-launch-outline"
            size="56"
          />
        </div>
      </template>
    </v-img>

    <div
      v-else
      class="d-flex align-center justify-center bg-grey-darken-3 flex-grow-0"
      style="height: 200px"
    >
      <v-icon
        color="grey"
        icon="mdi-rocket-launch-outline"
        size="56"
      />
    </div>

    <v-card-title class="text-h6">
      {{ rocket.full_name || 'N/A' }}
    </v-card-title>

    <v-card-text class="flex-grow-1 text-body-2">
      {{ rocket.description || 'N/A' }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  interface Props {
    rocket: Rocket
  }

  defineProps<Props>()

  const emit = defineEmits<{ select: [id: number | string] }>()
</script>
