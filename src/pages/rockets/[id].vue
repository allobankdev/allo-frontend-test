<template>
  <v-container>
    <h1 class="text-h4">
      Rocket {{ route.params.id }}
    </h1>
  </v-container>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router'

  const route = useRoute('/rockets/[id]')
</script>
