<template>
  <v-card
    class="rocket-item my-2 border-line cursor-pointer"
    variant="outlined"
    hover
    @click="$emit('click')"
  >
    <v-card-text class="pa-4">
      <v-row
        align="center"
        no-gutters
      >
        <!-- Item Index Number -->
        <v-col
          cols="auto"
          class="mr-4"
        >
          <span class="font-mono text-caption text-medium-emphasis">
            {{ formattedIndex }}
          </span>
        </v-col>

        <!-- Rocket Thumbnail Image -->
        <v-col
          cols="auto"
          class="mr-4"
        >
          <v-avatar
            rounded="sm"
            size="56"
            color="line"
          >
            <v-img
              v-if="rocket.imageUrl"
              :src="rocket.imageUrl"
              :alt="rocket.fullName || 'Rocket image'"
              cover
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height bg-surface">
                  <v-icon
                    icon="mdi-rocket-launch-outline"
                    color="steel"
                    size="24"
                  />
                </div>
              </template>
            </v-img>
            <v-icon
              v-else
              icon="mdi-rocket-launch-outline"
              color="steel"
              size="24"
            />
          </v-avatar>
        </v-col>

        <!-- Rocket Info -->
        <v-col class="overflow-hidden">
          <div class="d-flex align-center gap-2">
            <h3 class="text-subtitle-1 font-weight-bold text-truncate text-onSurface">
              {{ rocket.fullName || 'Unnamed Rocket' }}
            </h3>
            <v-chip
              v-if="rocket.isLocal"
              size="x-small"
              color="primary"
              variant="flat"
              class="font-mono ml-2"
            >
              LOCAL
            </v-chip>
          </div>

          <p class="text-body-2 text-secondary text-truncate mt-1 mb-0">
            {{ rocket.description || 'No description available for this vehicle.' }}
          </p>
        </v-col>

        <!-- Right Arrow Icon -->
        <v-col
          cols="auto"
          class="ml-2"
        >
          <v-icon
            icon="mdi-chevron-right"
            color="steel"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
  index: number
}>()

defineEmits<{
  (e: 'click'): void
}>()

const formattedIndex = computed(() => {
  const num = props.index + 1
  return num < 10 ? `0${num}` : `${num}`
})
</script>

<style scoped>
.rocket-item {
  transition: background-color 0.15s ease-in-out;
}
.rocket-item:hover {
  background-color: rgba(199, 194, 182, 0.25) !important;
}
</style>
