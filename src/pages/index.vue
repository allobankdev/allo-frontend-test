<template>
  <v-container>
    <h1 class="text-h3 mb-4">SpaceX Rockets</h1>

    <v-row align="center">
      <v-col>
        <v-text-field
          v-model="store.filterText"
          label="Filter by name"
          prepend-icon="mdi-magnify"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
          Add rocket
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="store.status === 'loading'">
      <v-progress-circular indeterminate color="primary" />
      <span class="ml-2">Loading rockets…</span>
    </div>

    <div v-else-if="store.status === 'error'">
      <v-alert type="error" :text="store.error ?? ''" />
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="store.fetchRockets()">
        Retry
      </v-btn>
    </div>

    <template v-else>
      <v-row>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <p v-if="!store.filteredRockets.length">No rockets match your filter.</p>
    </template>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>Add a rocket</v-card-title>
        <v-card-text>
          <v-text-field v-model="name" label="Name" required />
          <v-text-field v-model="imageUrl" label="Image URL" />
          <v-textarea v-model="description" label="Description" auto-grow rows="3" />
          <v-text-field v-model="costPerLaunch" label="Cost per launch (USD)" prefix="$" type="number" />
          <v-text-field v-model="country" label="Country" />
          <v-text-field v-model="firstFlight" label="First flight" type="date" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" :disabled="!name.trim()" @click="submit">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRocketStore } from '@/store/rocketStore'

  const store = useRocketStore()

  onMounted(() => {
    store.fetchRockets()
  })

  const dialog = ref(false)
  const name = ref('')
  const imageUrl = ref('')
  const description = ref('')
  const costPerLaunch = ref('')
  const country = ref('')
  const firstFlight = ref('')

  function submit () {
    store.addRocket({
      name: name.value.trim(),
      imageUrl: imageUrl.value.trim(),
      description: description.value.trim(),
      costPerLaunch: costPerLaunch.value,
      country: country.value,
      firstFlight: firstFlight.value,
    })
    name.value = ''
    imageUrl.value = ''
    description.value = ''
    costPerLaunch.value = ''
    country.value = ''
    firstFlight.value = ''
    dialog.value = false
  }
</script>