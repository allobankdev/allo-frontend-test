<script setup lang="ts">
import { useRocketStore } from '../../stores/userRocketStore'

type Launch = ReturnType<typeof useRocketStore>['rockets'][number]

const noImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'

const { show, launch } = defineProps<{
  show: boolean
  launch: Launch | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div v-if="show && launch" class="launch-modal" @click.self="closeModal">
    <div class="launch-modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <h2>{{ launch.name }}</h2>
      <img 
        :src="launch.links.patch.large || noImage" 
      />
      <p>{{ launch.details || "No details available." }}</p>
      <h4>Cost per launch : </h4>
      <h4>Country : </h4>
      <h4>First Flight : </h4>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.launch-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.launch-modal-content {
  position: relative;
  background: darkslategrey;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}

.launch-modal-content img {
  max-width: 100%;
  margin: 10px 0;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 28px;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  color: white;
}

.close-btn:hover {
  color: #cccccc;
}

</style>