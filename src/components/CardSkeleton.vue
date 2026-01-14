<template>
  <v-row>
    <v-col cols="12" :md="md" v-for="n in amount" :key="n">
      <v-skeleton-loader type="card" height="300" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  md?: string
  amount?: string
}>(), {
  md: "4",
  amount: "6",
})
</script>
