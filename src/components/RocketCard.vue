<template>
  <v-card
    class="rocket-card"
    :class="{ 'cursor-pointer': clickable }"
    hover
    @click="handleClick"
  >
    <v-img
      v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
      :src="rocket.flickr_images[0]"
      :alt="rocket.name"
      height="200"
      cover
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="grey-lighten-5"
            indeterminate
          />
        </div>
      </template>
    </v-img>
    <v-img
      v-else
      src="https://via.placeholder.com/400x200?text=No+Image"
      :alt="rocket.name"
      height="200"
      cover
    />

    <v-card-title>{{ rocket.name }}</v-card-title>
    
    <v-card-text>
      <div class="text-body-2 text-medium-emphasis">
        {{ truncatedDescription }}
      </div>
    </v-card-text>

    <v-card-actions v-if="showActions">
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        @click.stop="handleClick"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = withDefaults(defineProps<{
  rocket: Rocket
  clickable?: boolean
  showActions?: boolean
  descriptionLength?: number
}>(), {
  clickable: true,
  showActions: true,
  descriptionLength: 150,
})

const router = useRouter()

const truncatedDescription = computed(() => {
  if (!props.rocket.description) return 'No description available'
  
  if (props.rocket.description.length <= props.descriptionLength) {
    return props.rocket.description
  }
  
  return props.rocket.description.substring(0, props.descriptionLength) + '...'
})

function handleClick() {
  if (props.clickable) {
    router.push(`/rockets/${props.rocket.id}`)
  }
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.2s;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.cursor-pointer {
  cursor: pointer;
}
</style>

