<template>
  <v-app-bar
    color="#0a101d"
    elevation="2"
    density="comfortable"
    class="px-2 px-sm-4 border-b-subtle"
  >
    <div
      class="d-flex align-center cursor-pointer flex-shrink-0 mr-auto"
      @click="goToHome"
    >
      <v-avatar
        color="#ffbc25"
        size="36"
        class="mr-2 mr-sm-3 flex-shrink-0"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="#0a101d"
          size="20"
        />
      </v-avatar>

      <span class="text-subtitle-1 text-sm-h6 font-weight-bold text-white font-montserrat text-no-wrap">
        Allo Space
      </span>

      <v-chip
        size="x-small"
        color="#ffbc25"
        class="ml-2 font-weight-bold text-black d-none d-sm-inline-flex"
        variant="flat"
      >
        SpaceX Fleet
      </v-chip>
    </div>

    <v-btn
      prepend-icon="mdi-plus"
      color="#ffbc25"
      variant="elevated"
      size="small"
      class="font-weight-bold text-black rounded-lg text-no-wrap ml-2"
      height="36"
      @click="$emit('open-add-dialog')"
    >
      <span class="d-none d-sm-inline">Add Rocket</span>
      <span class="d-inline d-sm-none">Add</span>
    </v-btn>
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
