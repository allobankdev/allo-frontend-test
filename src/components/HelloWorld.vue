<template>
  <div class="dashboard">
    <div class="card">
      <img height="50" src="@/assets/blue-rocket-.png" />
      <div class="txt-title">Deejays Rocket</div>
    </div>
    <LandingPage />
  </div>
</template>

<script>
import LandingPage from './landing/index.vue';

export default {
  components: {
    LandingPage,
  },
};
</script>

<style scoped>
.dashboard {
  background: #ededed;
  height: 2000px;
}
.card {
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  background: #8F8F8F;
}
.txt-title{
  font-weight: bold;
  font-size: 24px;
  color: #000;
}
</style>
