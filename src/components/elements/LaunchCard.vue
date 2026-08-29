<script setup lang="ts">
import { useRocketStore } from '../../stores/userRocketStore'

type Launch = ReturnType<typeof useRocketStore>['rockets'][number]

const noImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'

const props = defineProps<{
  launch: Launch
}>()

const emit = defineEmits<{
  (e: 'open', launch: Launch): void
}>()

const handleClick = () => {
  emit('open', props.launch)
}

</script>

<template>
  <div class="launch-card" @click="handleClick">
    <header>
        <img class="launch-card__thumbnail_image" :src="launch.links.patch.small || noImage" alt="Rocket Patch"/>
    </header>
    <div class="launch-card__info">
        <strong>{{ launch.name }}</strong>
        <h5>{{ launch.details || 'No details available' }}</h5> 
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .launch-card {
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transition: 0.2s;
    &__thumbnail_image {
      width: 100%;
      object-fit: contain;
      margin-top: 0.75rem; 
    }
    &__info {
      margin-top: 10px;
      text-align: center;

      strong {
        font-size: 1.1rem;
      }

      h5 {
        margin-top: 8px;
        font-weight: normal;
      }
    }
    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
      background: darkslategray;
    }
  }
</style>
