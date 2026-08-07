<template>
    <b-button class="btn btn-primary" @click="modal = !modal">Toggle modal</b-button>

    <b-modal v-model="modal" title="Add New Rocket" ok-title="Save" @show="resetForm" @hidden="resetForm" @ok="handleSubmit">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <b-form @submit.prevent>
                        <b-form-group label="Rocket Name" label-for="rocket-name">
                            <b-form-input type="text" v-model="form.name" id="rocket-name" placeholder="Rocket Name" required ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Image URL" label-for="image-url">
                            <b-form-input type="text" v-model="form.imageUrl" id="image-url" placeholder="Image URL" required ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Description" label-for="description">
                            <b-form-input type="text" v-model="form.description" id="description" placeholder="Description" required ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Launch Cost" label-for="launch-cost">
                            <b-form-input type="text" v-model="form.launchCost" id="launch-cost" placeholder="Launch Cost" required ></b-form-input>
                        </b-form-group>
                        <b-form-group label="Country" label-for="country">
                            <b-form-input type="text" v-model="form.country" id="country" placeholder="Country" required ></b-form-input>
                        </b-form-group>
                        <b-form-group label="First Flight" label-for="first-flight">
                            <b-form-input type="text" v-model="form.maidenFlight" id="first-flight" placeholder="First Flight" required ></b-form-input>
                        </b-form-group>
                        <!-- <input v-model="form.name" id="rocket-name" class="form-control" placeholder="Rocket Name" required />
                        <input v-model="form.imageUrl" class="form-control" placeholder="Image Url" required /> -->
                        <!-- <input v-model="form.description" class="form-control" placeholder="Description" required /> -->
                        <!-- <input v-model="form.launchCost" class="form-control" placeholder="Launch Cost" required /> -->
                        <!-- <input v-model="form.country" class="form-control" placeholder="Country" required /> -->
                        <!-- <input v-model="form.maidenFlight" class="form-control" placeholder="First Flight" required /> -->
                        <!-- <button type="submit" class="btn-primary">Save</button>
                        <button type="button" class="btn-close" @click="emit('close')">Cancel</button> -->
                    </b-form>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import { BButton, BForm, BFormGroup, BModal, BFormInput } from 'bootstrap-vue-next';

const modal = ref(false)

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const rocketStore = useRocketStore()

const form = reactive({
    name: '',
    imageUrl: '',
    description: '',
    launchCost: '',
    country: '',
    maidenFlight: ''
})

const resetForm = () => {
    form.name = ''
    form.imageUrl = ''
    form.description = ''
    form.launchCost = ''
    form.country = ''
    form.maidenFlight = ''
}

const handleSubmit = () => {
    if (!form.name) return

    rocketStore.addRocket(
        form.name,
        form.imageUrl,
        form.description,
        form.launchCost,
        form.country,
        form.maidenFlight
    )

    resetForm()

    emit('close')
}

</script>
