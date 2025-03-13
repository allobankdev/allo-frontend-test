<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['open-dialog']);
</script>

<template>
  <div class="mt-8 text-center">
    <v-btn color="primary" @click="emit('open-dialog')">Add New Rocket</v-btn>
  </div>
</template>
