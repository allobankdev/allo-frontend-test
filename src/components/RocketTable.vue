<template>

<table>

<thead>
<tr>
  <th>Picture</th>
  <th>Name</th>
  <th>Description</th>
</tr>
</thead>

<tbody>

<tr
  v-for="rocket in rockets"
  :key="rocket.id"
  @click="$emit('select',rocket)"
>

<td>
<img
  :src="rocket.flickr_images[0]"
  width="150"
/>
</td>

<td>{{ rocket.name }}</td>

<td>{{ rocket.description }}</td>

</tr>

</tbody>

</table>

</template>

<script setup lang="ts">

import type { Rocket } from '../types/Rocket'

defineProps<{
  rockets: Rocket[]
}>()

defineEmits(['select'])

</script>