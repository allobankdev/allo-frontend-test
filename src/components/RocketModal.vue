<template>
  <div class="backdrop" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <v-btn color="black" icon="mdi-close-circle" @click="closeModal" />
        <h1>{{ rocket?.name }}</h1>
      </div>
      <div class="modal-content">
        <div class="modal-content_image">
          <v-img
            :src="rocket?.links.patch.small"
            alt="Rocket Patch"
            height="200"
          />
        </div>
        <div class="modal-content_description">
          <h3>Rocket Information</h3>
          <div>
            <span class="modal-content_subtext">Rocket first launch: </span>
            <span>{{ rocket?.date_local }}</span>
          </div>
          <div>
            <span class="modal-content_subtext"> Description: </span>
            <span v-if="!rocket?.details"> No description </span>
            <span v-else> {{ rocket.details }} </span>
          </div>
        </div>

        <div v-if="rocket?.flickr?.original">
          <v-img
            v-for="(image, index) in rocket.flickr?.original ?? []"
            :key="index"
            :src="image"
            alt="Rocket Images"
            height="200"
            cover
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rocket } from "../types/Rocket";

defineProps<{ rocket?: Rocket }>();

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.backdrop {
  display: flex;
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.modal {
  width: 50%;
  max-height: 80vh;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  margin: 100px auto;
  background: linear-gradient(to bottom, black 10%, #212121 40%, #3F51B5 90%);
  border-radius: 10px;

  &-header {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 14px;
  }

  &-content {
    padding: 30px;

    &_image{
      padding-bottom: 18px;
    }

    &_subtext {
      font-weight: 600;
    }

    &_description{
      border-top: 2px solid DodgerBlue ;
    }
  }
}
</style>
