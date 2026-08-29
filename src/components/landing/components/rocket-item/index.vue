<template>
  <router-link :to="`/rockets/${rocket.id}`">
    <div class="card">
      <div class="border-card">
        <img
          class="img-list"
          v-if="rocket.flickr_images?.length"
          :src="rocket.flickr_images[1]"
          width="200"
        />
        <div class="name-descripption">
          <div class="txt-name">{{ rocket.name }}</div>
          <div class="txt-desc">{{ rocket.description }}</div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ rocket: Object });

const image = computed(
  () =>
    props.rocket.flickr_images?.[0] ||
    "https://via.placeholder.com/400x250?text=No+Image"
);

const shortDescription = computed(() =>
  props.rocket.description
    ? props.rocket.description.slice(0, 120) + "..."
    : "No description"
);
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  margin: 10px 220px;
  background: azure;
  border: 1px solid blueviolet;
  border-radius: 20px;
  padding: 12px;
}
.img-list {
  border-radius: 10px;
}
.border-card {
    display: flex;
   justify-content: flex-start;
   gap: 10px;
}
.name-descripption{
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.txt-name{
    font-weight: 800;
    color: rgb(64, 16, 108);
}
.txt-desc{
    color: rgb(64, 16, 108);
    text-align: justify;
}
</style>
