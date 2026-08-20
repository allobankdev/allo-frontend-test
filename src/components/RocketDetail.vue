<template>

<div v-if="rocket">

<h2>Rocket Detail</h2>

<table>

<tr>
<td>Cost Per Launch</td>
<td>{{ rocket.cost_per_launch }}</td>
</tr>

<tr>
<td>Country</td>
<td>{{ rocket.country }}</td>
</tr>

<tr>
<td>First Flight</td>
<td>{{ rocket.first_flight }}</td>
</tr>

</table>

</div>

</template>

<script setup lang="ts">

import type { Rocket } from '../types/Rocket'

defineProps<{
 rocket: Rocket | null
}>()

</script>