<script setup lang="ts">
defineProps({
  rocket: {
    type: Object,
    required: true,
  },
})

defineEmits(['detail'])
</script>

<template>
  <v-card
    class="h-100 d-flex flex-column"
    elevation="2"
  >
    <v-img
      :src="rocket.image_url || undefined"
      height="220"
      cover
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon
            size="64"
            color="grey"
          >
            mdi-rocket
          </v-icon>
        </div>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title>
        {{ rocket.full_name || rocket.name || 'Unknown Rocket' }}
      </v-card-title>

      <v-card-subtitle>
        {{ rocket.name }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="flex-grow-1">
      <p class="text-body-2">
        {{ rocket.description || 'No description available.' }}
      </p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        @click="$emit('detail', rocket.id)"
      >
        View Detail
        <v-icon end>
          mdi-arrow-right
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>