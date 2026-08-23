<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps({
  rocket: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()
const fallbackImage = 'https://via.placeholder.com/400x300?text=No+Rocket+Image'

const goToDetail = () => {
  if (props.rocket && props.rocket.id) {
    router.push(`/rocket/${props.rocket.id}`)
  }
}
</script>

<template>
  <div
    class="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden"
    @click="goToDetail"
  >
    <img
      :src="rocket?.image_url || fallbackImage"
      :alt="rocket?.full_name"
      class="w-full h-48 object-cover"
    >
    <div class="p-5">
      <h2 class="text-xl font-bold mb-2 text-slate-800">
        {{ rocket?.full_name }}
      </h2>
      <p class="text-gray-600 text-sm line-clamp-3">
        {{ rocket?.description || 'No description available for this rocket.' }}
      </p>
    </div>
  </div>
</template>