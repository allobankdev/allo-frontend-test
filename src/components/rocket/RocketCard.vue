<script setup lang="ts">
import type {
  Rocket,
} from '@/types/rocket'

import SafeImage
  from '@/components/common/SafeImage.vue';


defineProps<{
  rocket: Rocket
}>()
</script>


<template>
  <RouterLink
    class="rocket-card"
    :to="`/rocket/${rocket.id}`"
  >

    <div class="rocket-image">

      <SafeImage
        :src="rocket.image_url"

        :alt ="
          rocket.full_name ||
          'Rocket Image'
          "
      />
    </div>


    <div class="rocket-content">

      <span
        v-if="rocket.isLocal"
        class="local-badge"
      >
        Local
      </span>


      <h2>
        {{
          rocket.full_name ||
          'Unnamed rocket'
        }}
      </h2>


      <p>
        {{
          rocket.description ||
          'Description not available.'
        }}
      </p>


      <span class="view-detail">
        View details →
      </span>

    </div>

  </RouterLink>
</template>

<style scoped
  src="@/components/rocket/style/rocketcard.css"
></style>

