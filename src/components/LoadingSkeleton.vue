<template>
  <v-row>
    <v-col
      v-for="n in count"
      :key="n"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card
        class="h-100 rounded-lg overflow-hidden"
        elevation="2"
      >
        <v-skeleton-loader
          type="image, article, actions"
          height="380"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 6,
  }
)
</script>
