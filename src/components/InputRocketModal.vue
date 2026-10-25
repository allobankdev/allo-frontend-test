<template>
    <b-button :disabled="isLoading" class="btn btn-primary" @click="modal = true">Add Rocket</b-button>

    <b-modal v-model="modal" title="Add New Rocket" ok-title="Save" @show="resetForm" @hidden="resetForm"
        @ok="handleSubmit">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <b-form @submit.prevent>
                        <b-form-group label="Rocket Name" label-for="rocket-name">
                            <b-form-input :state="nameState" type="text" v-model="form.name" id="rocket-name" placeholder="Rocket Name"
                                required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Image URL" label-for="image-url"
                            invalid-feedback="Please enter a valid URL (e.g., https://example.com)">
                            <b-form-input :state="urlState" type="text" v-model="form.imageUrl" id="image-url"
                                placeholder="Image URL" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Description" label-for="description">
                            <b-form-input :state="descriptionState" type="text" v-model="form.description" id="description"
                                placeholder="Description" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Launch Cost" label-for="launch-cost"
                            invalid-feedback="Please enter numbers only">
                            <b-form-input :state="costState" type="text" v-model="form.launchCost" id="launch-cost"
                                placeholder="0" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Country" label-for="country">
                            <b-form-input :state="countryState" type="text" v-model="form.country" id="country" placeholder="USA"
                                required></b-form-input>
                        </b-form-group>
                        <b-form-group label="First Flight Date" label-for="first-flight"
                            invalid-feedback="Please enter a date in YYYY-MM-DD format">
                            <b-form-input :state="dateState" type="text" v-model="form.maidenFlight" id="first-flight"
                                placeholder="YYYY-MM-DD" required></b-form-input>
                        </b-form-group>
                    </b-form>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import { BButton, BForm, BFormGroup, BModal, BFormInput, BvTriggerableEvent } from 'bootstrap-vue-next';

defineProps<{
    isLoading: boolean
}>()

const modal = ref(false)

const nameState = ref<boolean | null>(null)
const urlState = ref<boolean | null>(null)
const descriptionState = ref<boolean | null>(null)
const costState = ref<boolean | null>(null)
const countryState = ref<boolean | null>(null)
const dateState = ref<boolean | null>(null)

const emit = defineEmits(['close'])

const rocketStore = useRocketStore()

const form = reactive({
    name: '',
    imageUrl: '',
    description: '',
    launchCost: '',
    country: '',
    maidenFlight: '',
    nameState: null,
    urlState: null,
    descriptionState: null,
    costState: null,
    countryState: null,
    dateState: null
})

const resetForm = () => {
    form.name = ''
    form.imageUrl = ''
    form.description = ''
    form.launchCost = ''
    form.country = ''
    form.maidenFlight = ''
}

const isNameValid = computed<boolean | null>(() => {
    let res:boolean | null = true
    if (!form.name) res = null
    nameState.value = res
    return res
})

const isUrlValid = computed<boolean | null>(() => {
    let res:boolean | null = true
    if (!form.imageUrl) res = null
    try {
        const parsed = new URL(form.imageUrl)
        res = parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        res = false
    }
    urlState.value = res
    return res
})

const isDescriptionValid = computed<boolean | null>(() => {
    let res:boolean | null = true
    if (!form.description) res = null
    descriptionState.value = res
    return res
})

const isNumberValid = computed<boolean | null>(() => {
    let res:boolean | null = true
    if (!form.launchCost) res = null
    res = /^-?\d+(\.\d+)?$/.test(form.launchCost)
    costState.value = res
    return res
})

const isCountryValid = computed<boolean | null>(() => {
    let res:boolean | null = true
    if (!form.country) res = null
    countryState.value = res
    return res
})

const isDateValid = computed<boolean | null>(() => {
    let res:boolean | null = true
    if (!form.maidenFlight) res = null

    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!form.maidenFlight.match(regex)) res = false

    const dateParts = form.maidenFlight.split('-')
    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1
    const day = parseInt(dateParts[2], 10)
    const date = new Date(year, month, day)

    res = (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
    )

    dateState.value = res
    return res
})

const handleSubmit = (event: BvTriggerableEvent) => {
    event.preventDefault()

    let invalidCount: number = 0
    if (!isNameValid.value) invalidCount++
    if (!isUrlValid.value) invalidCount++
    if (!isDescriptionValid.value) invalidCount++
    if (!isNumberValid.value) invalidCount++
    if (!isCountryValid.value) invalidCount++
    if (!isDateValid.value) invalidCount++
    if (invalidCount > 0) return

    rocketStore.addRocket(
        form.name,
        form.imageUrl,
        form.description,
        form.launchCost,
        form.country,
        form.maidenFlight
    )

    resetForm()

    modal.value = false
}

</script>
