<template>
  <v-app-bar
    color="#0a101d"
    elevation="2"
    class="px-md-4 border-b-subtle"
  >
    <template #prepend>
      <v-avatar
        color="#ffbc25"
        size="38"
        class="mr-3"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="#0a101d"
          size="22"
        />
      </v-avatar>
    </template>

    <v-app-bar-title
      class="cursor-pointer"
      @click="goToHome"
    >
      <div class="d-flex align-center">
        <span class="text-h6 font-weight-bold text-white font-montserrat">Allo Space</span>
        <v-chip
          size="x-small"
          color="#ffbc25"
          class="ml-2 font-weight-bold text-black"
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
        color="#ffbc25"
        variant="elevated"
        class="font-weight-bold text-black rounded-lg"
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
.font-montserrat {
  font-family: 'Montserrat', sans-serif !important;
  letter-spacing: -0.01em;
}
.border-b-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
</style>
