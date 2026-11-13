<template>
  <v-text-field
    clearable
    density="comfortable"
    hide-details
    label="Cari rocket"
    :model-value="model"
    placeholder="Nama atau deskripsi"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    @update:model-value="model = $event ?? ''"
  />
</template>

<script lang="ts" setup>
  const model = defineModel<string>({ default: '' })
</script>