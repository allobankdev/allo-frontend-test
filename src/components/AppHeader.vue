<template>
  <v-app-bar
    color="surface"
    density="comfortable"
  >
    <v-container class="d-flex align-center py-0">
      <router-link
        class="brand"
        to="/"
      >
        <v-icon
          icon="mdi-rocket-launch-outline"
          size="22"
        />
        <span>Rockets</span>
      </router-link>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
}
</style>
