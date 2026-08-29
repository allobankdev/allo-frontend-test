<template>
  <BaseCard class="add-rocket-form">
    <h2>Add New Rocket</h2>
    <form @submit.prevent="handleSubmit">
      <BaseInput
        v-model="formData.name"
        label="Rocket Name"
        placeholder="Enter rocket name"
        required
      />
      <BaseInput
        v-model="formData.country"
        label="Country"
        placeholder="Enter country"
        required
      />
      <BaseInput
        v-model="formData.description"
        label="Description"
        type="textarea"
        placeholder="Enter description"
        required
      />
      <BaseInput
        v-model="formData.image"
        label="Image URL"
        type="url"
        placeholder="Enter image URL"
        required
      />
      <BaseInput
        v-model.number="formData.cost_per_launch"
        label="Cost per Launch"
        type="number"
        placeholder="Enter cost"
        required
      />
      <BaseInput
        v-model="formData.first_flight"
        label="First Flight"
        type="date"
        required
      />
      <div class="form-actions">
        <BaseButton type="submit" variant="primary">Add Rocket</BaseButton>
        <BaseButton type="button" variant="secondary" @click="handleCancel">
          Cancel
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup>
import { reactive } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  name: '',
  country: '',
  description: '',
  image: '',
  cost_per_launch: 0,
  first_flight: ''
})

const handleSubmit = () => {
  // Convert single image URL to flickr_images array format
  const rocketData = {
    ...formData,
    flickr_images: formData.image ? [formData.image] : []
  }
  // Remove the old 'image' field
  delete rocketData.image

  emit('submit', rocketData)
  resetForm()
}

const handleCancel = () => {
  emit('cancel')
  resetForm()
}

const resetForm = () => {
  formData.name = ''
  formData.country = ''
  formData.description = ''
  formData.image = ''
  formData.cost_per_launch = 0
  formData.first_flight = ''
}
</script>

<style scoped>
.add-rocket-form {
  max-width: 600px;
  margin: 0 auto;
}

.add-rocket-form h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 20px 0;
}

.add-rocket-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.form-actions button {
  flex: 1;
}
</style>
