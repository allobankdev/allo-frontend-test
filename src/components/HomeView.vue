<template>
  <v-container
    fluid
    class="pa-0 d-flex align-center justify-center hero-container"
  >
    <v-img
      src="https://live.staticflickr.com/65535/48954138962_ee541e6755_b.jpg"
      alt="SpaceX Rocket"
      cover
      height="100vh"
      class="hero-bg"
    >
      <div class="overlay" />

      <div class="hero-content text-center">
        <h1 class="text-h2 font-weight-bold mb-4 text-white">
          Explore SpaceX Rockets
        </h1>
        <p class="text-subtitle-1 mb-6 text-white">
          Discover all SpaceX rockets
        </p>
        <v-btn
          color="grey-darken-3"
          variant="flat"
          size="large"
          rounded="xl"
          class="px-8 py-4 mt-4 text-blue"
          to="/rocket"
        >
          View Rockets
        </v-btn>
      </div>
    </v-img>
  </v-container>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.hero-bg {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.56);
  z-index: 1;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  max-width: 700px;
  padding: 0 16px;
}
</style>
