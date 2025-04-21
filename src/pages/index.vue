<template>
  <v-container>
    <v-text-field
      v-model="search"
      label="Search"
      class="mb-4"
    />

    <v-btn
      color="primary"
      class="mb-4"
      @click="showAdd = !showAdd"
    >
      Add New Rocket
    </v-btn>

    <Form
      v-model="showAdd"
      @submit="onAddRocket"
      @close="showAdd = false"
    />

    <Loading v-if="store.loading" />

    <div v-else-if="store.error">
      <v-alert 
        type="error" 
        text
      >
        Failed to load rockets
      </v-alert>
      <v-btn
        color="red"
        @click="store.loadRockets"
      >
        Retry
      </v-btn>
    </div>

    <v-row v-else>
      <v-col
        v-for="r in filteredRockets"
        :key="r.id"
        cols="12"
        md="6"
        lg="4"
      >
        <Card
          :rocket="r"
          @click="goToDetail(r.id)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/store/rocketStore'

import Card from '@/components/Card.vue'
import Form from '@/components/Form.vue'
import Loading from '@/components/Loading.vue'

const store = useRocketStore()
const router = useRouter()

const search = ref('')
const showAdd = ref(false)

onMounted(() => {
  store.loadRockets()
})

const filteredRockets = computed(() =>
  store.rockets.filter((r) =>
    r.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

function goToDetail(id: string) {
  router.push(`/rockets/${id}`)
}

function onAddRocket(newRocket: {
  name: string
  description: string
  cost_per_launch: number
  country: string
  first_flight: string
}) {
  store.addRocket({
    ...newRocket,
    id: Date.now().toString(),
    flickr_images: [],
  })
  showAdd.value = false
}
</script>
