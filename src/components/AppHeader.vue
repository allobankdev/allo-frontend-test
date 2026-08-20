<template>
  <header class="app-header">
    <v-container class="app-header__inner app-shell">
      <RouterLink
        aria-label="Rocket Atlas home"
        class="app-brand"
        to="/"
      >
        <span
          class="app-brand__mark"
          aria-hidden="true"
        >
          <v-icon
            icon="mdi-rocket-launch-outline"
            size="22"
          />
        </span>

        <span>
          <strong>Rocket Atlas</strong>
          <small>SpaceX launch vehicles</small>
        </span>
      </RouterLink>

      <div class="app-header__source">
        <v-icon
          aria-hidden="true"
          icon="mdi-database-outline"
          size="16"
        />
        Launch Library 2
      </div>
    </v-container>
  </header>
</template>
