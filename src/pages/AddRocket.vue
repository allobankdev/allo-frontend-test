<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRocketStore } from '@/stores/rocket.store';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const rocketStore = useRocketStore();
  const name = ref('');
  const image = ref('');
  const description = ref('');

  const submit = () => {
    rocketStore.AddRocket({
      name: name.value,
      description: description.value,
      image: [image.value || 'https://via.placeholder.com/150']
    });
    name.value = '';
    image.value = '';
    description.value = '';
    router.push('/');
  };
</script>
<template>
  <div>
    <v-card class="pa-4">
      <v-text-field v-model="name" label="Name" />
      <v-text-field v-model="image" label="Image URL" />
      <v-textarea v-model="description" label="Description" />
      <v-btn color="primary" @click="submit">Add Rocket</v-btn>
   </v-card>

  </div>
</template>
