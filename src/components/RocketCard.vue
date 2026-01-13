<script setup>
import { useRouter } from "vue-router";
import { defineProps } from "vue";

defineProps({
  rocket: Object,
});

const router = useRouter();

</script>

<template>
  <div
    class="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    @click="router.push(`/rocket/${rocket.id}`)"
  >
    <img
      :src="rocket.flickr_images[0]"
      alt="rocket"
      class="h-48 w-full object-cover rounded-t-lg"
    />
    <div class="py-2 px-2">
      <h2 class="font-semibold text-lg">{{ rocket.name }}</h2>
      <p class="text-sm text-gray-600 line-clamp-3">
        {{ rocket.description }}
      </p>
    </div>
  </div> 
</template>
