<template>
  <v-app-bar
    color="#0B132B"
    elevation="3"
    class="px-md-4"
  >
    <template #prepend>
      <v-avatar
        color="deep-purple-darken-3"
        size="40"
        class="mr-3"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="amber"
        />
      </v-avatar>
    </template>

    <v-app-bar-title
      class="cursor-pointer"
      @click="goToHome"
    >
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-bold text-white tracking-wide">Allo Space</span>
        <v-chip
          size="x-small"
          color="amber"
          class="ml-2 font-weight-medium"
          variant="flat"
        >
          SpaceX Fleet
        </v-chip>
      </div>
    </v-app-bar-title>

    <v-spacer />

    <div class="d-flex align-center ga-2">
      <v-btn
        prepend-icon="mdi-plus-circle"
        color="amber"
        variant="elevated"
        class="font-weight-bold"
        @click="$emit('open-add-dialog')"
      >
        <span class="d-none d-sm-inline">Add Rocket</span>
        <span class="d-inline d-sm-none">Add</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

defineEmits<{
  (e: 'open-add-dialog'): void
}>()

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.tracking-wide {
  letter-spacing: 0.05em;
}
</style>
