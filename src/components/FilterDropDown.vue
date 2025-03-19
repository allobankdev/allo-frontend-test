<template>
  <div class="text-center">
    <v-menu location='bottom'>
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          Filter
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(rocketName, index) in rocketNames"
          :key="index"
          @click="displayRocket(rocketName)"
        >
          <v-list-item-title>{{ rocketName }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { useRocketStore } from '../stores/rocketStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const rocketStore = useRocketStore();
const { getRocketNames } = storeToRefs(rocketStore);
const rocketNames = computed(() => getRocketNames.value);
const emit = defineEmits(['displayRocket'])
const displayRocket = (rocketName : string) =>{
  emit('displayRocket', rocketName);
}

</script>
