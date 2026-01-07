<script setup lang="ts">
defineProps<{
  images: string[];
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="800px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Rocket Images</v-card-title>
      <v-card-text>
        <v-carousel
          show-arrows="hover"
          cycle
          hide-delimiter-background
        >
          <v-carousel-item
            v-for="(img, i) in images"
            :key="i"
          >
            <v-img
              :src="img"
              cover
            />
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="emit('update:modelValue', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
