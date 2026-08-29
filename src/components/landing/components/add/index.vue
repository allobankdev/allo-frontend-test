<template>
  <form @submit.prevent="submit" class="add-form mt-5">
    <div class="txt-title">Add Rocket</div>
    <input class="place" v-model="name" placeholder="Name" required />
    <textarea
      class="place"
      v-model="description"
      placeholder="Description"
    ></textarea>
    <input class="place" v-model="image" placeholder="Image URL" />
    <button class="btn-add" type="submit">Add</button>
  </form>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["add"]);

const name = ref("");
const description = ref("");
const image = ref("");

function submit() {
  const payload = {
    name: name.value,
    description: description.value,
    flickr_images: image.value ? [image.value] : [],
  };
  emit("add", payload);
  name.value = description.value = image.value = "";
}
</script>

<style lang="scss">
.txt-title {
  font-weight: 800;
  color: blueviolet;
  margin-left: 10px;
}
.add-form {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.place {
  color: blueviolet;
  border: 1px solid blueviolet;
  border-radius: 20px;
  padding: 16px;
  width: 50%;
}
.btn-add {
  background: azure;
  color: blueviolet;
  border: 1px solid blueviolet;
  border-radius: 20px;
  padding: 16px;
  width: 50%;
}
</style>
