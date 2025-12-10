<template>
  <div class="rocket-list">
    <div class="rocket-list-header">
      <h1>Rockets</h1>
      <v-btn color="primary" @click="openAddDialog"> + Add Rocket </v-btn>
    </div>

    <v-text-field
      v-model="rocketStore.searchQuery"
      label="Search rockets..."
      prepend-icon="mdi-magnify"
      clearable
      class="mb-6"
    />

    <v-container v-if="rocketStore.loading" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="60" />
      <p class="mt-4 loading-text">Loading rockets...</p>
    </v-container>

    <v-alert v-else-if="rocketStore.error" type="error" class="mb-4">
      {{ rocketStore.error }}
      <v-btn size="small" @click="rocketStore.fetchAllRockets">Retry</v-btn>
    </v-alert>

    <v-container v-else-if="!rocketStore.hasRockets" class="text-center py-16">
      <v-icon size="100" class="empty-state-icon mb-4">mdi-rocket</v-icon>
      <p class="empty-state-text">No rockets found</p>
    </v-container>

    <v-row v-else>
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" @click="goToDetail(rocket.id)" />
      </v-col>
    </v-row>

    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title>Add New Rocket</v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="newRocket.name"
              label="Rocket Name"
              required
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-text-field
              v-model="newRocket.type"
              label="Rocket Type"
              required
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-textarea
              v-model="newRocket.description"
              label="Description"
              required
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-text-field
              v-model.number="newRocket.cost_per_launch"
              label="Cost Per Launch (USD)"
              type="number"
              class="mb-4"
            />

            <v-text-field
              v-model="newRocket.country"
              label="Country"
              class="mb-4"
            />

            <v-text-field
              v-model="newRocket.first_flight"
              label="First Flight (YYYY-MM-DD)"
              type="date"
              class="mb-4"
            />

            <v-file-input
              v-model="imageFile"
              label="Rocket Image"
              accept="image/*"
              prepend-icon="mdi-image"
              show-size
              :rules="[rules.imageSize]"
              class="mb-4"
              hide-details="auto"
            />

            <div class="image-preview-wrapper" v-if="imagePreview">
              <p class="image-preview-label">Preview</p>
              <div class="image-preview-box">
                <img :src="imagePreview" alt="Rocket preview" />
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="handleCancel">Cancel</v-btn>
          <v-btn color="primary" :loading="isCreating" @click="handleAddRocket">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from './RocketCard.vue'
import type { Rocket } from '@/types/rocket'

const router = useRouter()
const rocketStore = useRocketStore()

const showAddDialog = ref(false)
const formValid = ref(false)
const isCreating = ref(false)
const form = ref<any | null>(null)

const MAX_IMAGE_SIZE = 1024 * 1024

const imageFile = ref<File | File[] | null>(null)
const imagePreview = ref<string | null>(null)

const rules = {
  required: (value: string) => !!value || 'This field is required',
  imageSize: (value: File | File[] | null) => {
    if (!value) return true
    const file = Array.isArray(value) ? value[0] : value
    if (!file) return true
    return (
      file.size <= MAX_IMAGE_SIZE ||
      `Image must be <= ${Math.round(MAX_IMAGE_SIZE / 1024)}KB`
    )
  },
}

const newRocket = ref<Partial<Rocket>>({
  name: '',
  type: '',
  description: '',
  cost_per_launch: undefined,
  country: '',
  first_flight: '',
  image: '',
})

const openAddDialog = () => {
  showAddDialog.value = true
}

const handleCancel = () => {
  showAddDialog.value = false
  resetForm()
}

const handleImageChange = (value: File | File[] | null) => {
  if (!value) {
    imagePreview.value = null
    newRocket.value.image = ''
    return
  }

  const file = Array.isArray(value) ? value[0] : value
  if (!file) {
    imagePreview.value = null
    newRocket.value.image = ''
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    imagePreview.value = null
    newRocket.value.image = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = reader.result as string
    newRocket.value.image = imagePreview.value || ''
  }
  reader.readAsDataURL(file)
}

watch(imageFile, (val) => {
  handleImageChange(val)
})

const resetForm = () => {
  newRocket.value = {
    name: '',
    type: '',
    description: '',
    cost_per_launch: undefined,
    country: '',
    first_flight: '',
    image: '',
  }
  imageFile.value = null
  imagePreview.value = null
  formValid.value = false
}

const handleAddRocket = async () => {
  if (!form.value) return
  const valid = await form.value.validate()
  if (!valid) return

  isCreating.value = true

  try {
    await rocketStore.addRocket(newRocket.value as Rocket)
    showAddDialog.value = false
    resetForm()
  } catch (err) {
    console.error('Failed to add rocket:', err)
  } finally {
    isCreating.value = false
  }
}

const goToDetail = (rocketId: string) => {
  router.push(`/rockets/${rocketId}`)
}

onMounted(() => {
  if (rocketStore.rockets.length === 0 && !rocketStore.loading) {
    rocketStore.fetchAllRockets()
  }
})
</script>

<style scoped>
.rocket-list {
  padding: 24px;
  background-color: #fafafa;
}

.rocket-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
}

.rocket-list-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 500;
  color: #1a1a1a;
}

.loading-text {
  margin-top: 16px !important;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 500;
}

.empty-state-icon {
  color: #1976d2 !important;
  opacity: 0.7;
}

.empty-state-text {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 500;
  margin-top: 12px;
}

/* preview image kecil */
.image-preview-wrapper {
  margin-bottom: 16px;
}

.image-preview-label {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #555;
}

.image-preview-box {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.image-preview-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

@media (max-width: 600px) {
  .rocket-list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rocket-list {
    padding: 16px;
  }

  .rocket-list-header h1 {
    font-size: 24px;
  }
}
</style>
