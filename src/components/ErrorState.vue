<template>
  <v-alert type="error" >
    An error occurred while loading data.
    <v-btn variant="text" @click="$emit('retry')">Retry</v-btn>
  </v-alert>
</template>
<script lang="ts" setup>
</script>
