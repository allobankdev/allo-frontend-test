<template>
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Add New Rocket</h2>
                <button @click="handleClose" class="close-button">&times;</button>
            </div>

            <form @submit.prevent="handleSubmit" class="rocket-form">
                <div class="form-group">
                    <label for="name" class="form-label">Rocket Name *</label>
                    <input id="name" v-model="formData.name" type="text" required class="form-input"
                        placeholder="e.g. Falcon 10" />
                </div>

                <div class="form-group">
                    <label for="description" class="form-label">Description *</label>
                    <textarea id="description" v-model="formData.description" required rows="4" class="form-textarea"
                        placeholder="Describe the rocket..." />
                </div>

                <div class="form-group">
                    <label for="country" class="form-label">Country *</label>
                    <input id="country" v-model="formData.country" type="text" required class="form-input"
                        placeholder="e.g. United States" />
                </div>

                <div class="form-group">
                    <label for="cost" class="form-label">Cost per Launch ($) *</label>
                    <input id="cost" v-model.number="formData.cost_per_launch" type="number" required min="0"
                        class="form-input" placeholder="e.g. 50000000" />
                </div>

                <div class="form-group">
                    <label for="first_flight" class="form-label">First Flight *</label>
                    <input id="first_flight" v-model="formData.first_flight" type="date" required class="form-input" />
                </div>

                <!-- Images -->
                <div class="form-group">
                    <label class="form-label">Images</label>
                    <div class="images-list">
                        <div v-for="(image, index) in formData.flickr_images" :key="index" class="image-item">
                            <input v-model="formData.flickr_images[index]" type="url" class="form-input"
                                :placeholder="`Image URL ${index + 1}`" />
                            <button v-if="formData.flickr_images.length > 1" type="button" @click="removeImage(index)"
                                class="btn-remove" title="Remove image">
                                ✕
                            </button>
                        </div>
                    </div>
                    <button type="button" @click="addImage" class="btn-add-image">
                        + Add Image URL
                    </button>
                </div>

                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input v-model="formData.active" type="checkbox" class="form-checkbox" />
                        <span>Active Rocket</span>
                    </label>
                </div>

                <div class="form-actions">
                    <button type="button" @click="handleClose" class="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" class="btn-submit">
                        Add Rocket
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Rocket } from '@/types/rocket'

interface Props {
    isOpen: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'submit', rocket: Omit<Rocket, 'id'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const todayISO = () => {
    return new Date().toISOString().split('T')[0]
}

const initialFormData = () => ({
    name: '',
    description: '',
    country: '',
    cost_per_launch: 0,
    first_flight: todayISO(),
    flickr_images: [''],
    active: true,
})

const formData = ref(initialFormData())

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        formData.value = initialFormData()
    }
})

const addImage = () => {
    formData.value.flickr_images.push('')
}

const removeImage = (index: number) => {
    if (formData.value.flickr_images.length > 1) {
        formData.value.flickr_images.splice(index, 1)
    }
}

const handleSubmit = () => {
    const rocket: Omit<Rocket, 'id'> = {
        ...formData.value,
        flickr_images: formData.value.flickr_images.filter(img => img.trim() !== '')
    }

    emit('submit', rocket)
    handleClose()
}

const handleClose = () => {
    emit('close')
}

const handleOverlayClick = () => {
    handleClose()
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 0.75rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
}

.close-button {
    background: none;
    border: none;
    font-size: 2rem;
    color: #6b7280;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    color: #1f2937;
}

.rocket-form {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
    color: #1f2937;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
    resize: vertical;
    font-family: inherit;
}

.images-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.image-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.image-item .form-input {
    flex: 1;
    margin-bottom: 0;
}

.btn-remove {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.btn-remove:hover {
    background-color: #dc2626;
}

.btn-add-image {
    width: 100%;
    padding: 0.625rem;
    background-color: #f3f4f6;
    color: #374151;
    border: 1px dashed #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-add-image:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
}

.checkbox-group {
    display: flex;
    align-items: center;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
}

.form-checkbox {
    width: 1.125rem;
    height: 1.125rem;
    cursor: pointer;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-cancel {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-cancel:hover {
    background-color: #e5e7eb;
}

.btn-submit {
    background-color: #3b82f6;
    color: white;
}

.btn-submit:hover {
    background-color: #2563eb;
}
</style>