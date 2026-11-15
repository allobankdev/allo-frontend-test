<script setup lang="ts">
import '@/styles/main.css'
</script>

<template>
  <v-app>
    <a
      class="skip-link"
      href="#main-content"
    >Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <router-link
          to="/"
          class="brand"
          aria-label="Launch Atlas home"
        >
          <span
            class="brand-mark"
            aria-hidden="true"
          >↗</span> LAUNCH ATLAS
        </router-link>
        <router-link
          to="/"
          class="nav-link"
        >
          Rocket catalog
        </router-link>
      </div>
    </header>
    <v-main>
      <main
        id="main-content"
        class="page-shell"
      >
        <router-view />
      </main>
    </v-main>
    <footer class="site-footer">
      <span>Launch Atlas</span>
      <a
        href="https://thespacedevs.com/llapi"
        target="_blank"
        rel="noopener noreferrer"
      >Data from The Space Devs ↗</a>
    </footer>
  </v-app>
</template>
