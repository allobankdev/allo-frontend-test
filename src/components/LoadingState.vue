<template>
  <div class="my-8 text-center">
    <v-progress-linear
      indeterminate
      color="primary"
      class="mb-4"
    />
    <div class="spec-label text-body-2 text-steel">
      <v-icon
        icon="mdi-sync"
        class="mdi-spin mr-1"
        size="18"
      />
      Loading rocket data...
    </div>
  </div>
</template>

<script setup lang="ts"></script>
