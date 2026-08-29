<script lang="ts" setup>

defineProps<{rocket: any}>()

</script>
<template>
  <v-card class="rocket-card" @click="$router.push(`/rocket/${rocket.id}`)">
    <v-img :src="rocket.links?.patch?.small" height="180" class="rounded" cover>
      <template #placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-card-title class="text-subtitle-1 font-weight-bold">{{ rocket.name }}</v-card-title>
  </v-card>
</template>
<style scoped>
  .rocket-card {
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.25s ease;
  }

  .rocket-card:hover {
    transform: translate(-6px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);;
  }
</style>
