<template>
  <v-app-bar
    flat
    density="comfortable"
    color="surface"
    class="border-b px-2 px-md-4"
    style="border-color: rgba(255, 255, 255, 0.08) !important;"
  >
    <div
      class="d-flex align-center cursor-pointer"
      @click="goToHome"
    >
      <v-avatar
        color="primary"
        size="36"
        class="me-3"
        rounded="sm"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="#090d16"
          size="22"
        />
      </v-avatar>
      <div>
        <div
          class="text-subtitle-1 font-weight-bold text-high-emphasis text-uppercase"
          style="letter-spacing: 1.5px;"
        >
          SPACEX <span class="text-primary">FLEET</span>
        </div>
        <div
          class="text-caption text-secondary"
          style="font-size: 0.7rem !important; margin-top: -3px;"
        >
          FLIGHT CONFIGURATION DIRECTORY
        </div>
      </div>
    </div>

    <v-spacer />

    <!-- Allo Bank Assessment Badge -->
    <v-chip
      size="small"
      variant="outlined"
      color="secondary"
      class="d-none d-sm-flex me-3"
      style="letter-spacing: 0.5px; border-color: rgba(255, 255, 255, 0.15);"
    >
      <v-icon
        icon="mdi-bank"
        start
        size="14"
        color="primary"
      />
      ALLO BANK TEST
    </v-chip>

    <!-- Quick Add Button -->
    <v-btn
      color="primary"
      variant="flat"
      prepend-icon="mdi-plus"
      class="text-none font-weight-bold"
      rounded="sm"
      @click="$emit('open-add-dialog')"
    >
      Add Rocket
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
