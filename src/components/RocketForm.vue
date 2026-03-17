<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRocketsStore } from '@/store/rocket'
import type { Rocket } from '@/types/rocket'

const rocketStore = useRocketsStore()

defineProps<{
    modelValue: string
    dropDownList: Rocket[]
}>()

const selectedRocketId = ref('')

const emit = defineEmits<{
    (e: 'add-rocket', rocket: Rocket): void,
    (e: 'update:modelValue', value: string): void
}>()

const addRocket = () => {
    if (!selectedRocketId.value) return

    const rocket = rocketStore.items.find(
        r => r.id === selectedRocketId.value
    )

    if (!rocket) return

    emit('add-rocket', rocket)

    selectedRocketId.value = ''
}
</script>

<template>
    <form @submit.prevent="addRocket">
        <div class="mt-4">

            <div class="d-flex flex-row gap-4 align-items-end justify-content-between flex-wrap">

                <div class="form-group">
                    <label for="add-rocket" class="sr-only">Add Rocket</label>

                    <div class="d-flex">
                        <select class="form-control rounded-end-0" id="add-rocket" v-model="selectedRocketId" required>
                            <option value="">Select rocket</option>

                            <option v-for="rocket in dropDownList" :key="rocket.id" :value="rocket.id">
                                {{ rocket.name }}
                            </option>

                        </select>
                        <button class="btn btn-primary rounded-start-0" type="submit">+</button>
                    </div>
                </div>



                <div class="form-group">
                    <label for="search-rocket" class="sr-only">Search Rocket</label>
                    <input class="form-control" id="search-rocket" :value="modelValue" placeholder="Rocket name"
                        @input="emit('update:modelValue', $event.target.value)" />
                </div>

            </div>
        </div>
    </form>
</template>