<template>
    <v-dialog v-model="isOpen" max-width="500">
        <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="primary">Add Rocket</v-btn>
        </template>

        <v-card>
            <v-card-title>Add New Rocket</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="handleSubmit">
                    <v-text-field v-model="form.full_name" label="Rocket Name" required />
                    <v-textarea v-model="form.description" label="Description" required />
                    <v-text-field v-model="form.image_url" label="Image URL (optional)" />
                    <v-text-field v-model="form.launch_cost" label="Launch Cost (optional)" />
                    <v-text-field v-model="form.maiden_flight" label="Maiden Flight (optional)" />
                    <v-text-field v-model="form.manufacturer.name" label="Manufacturer Name" required />
                    <v-text-field v-model="form.manufacturer.country_code" label="Country (e.g. USA)" required />

                    <v-btn type="submit" color="primary" block class="mt-4">Submit</v-btn>
                    <v-btn type="button" @click="closeDialog" color="danger" block>
                        Cancel
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRocketStore } from '@/stores/rocket';
import type { Rocket } from '@/types/Rocket';

const rocketStore = useRocketStore();
const isOpen = ref(false);

const form = ref<Omit<Rocket, 'id'>>({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    maiden_flight: '',
    manufacturer: {
        id: 0,
        name: '',
        country_code: '',
    }
});

const closeDialog = () => {
    form.value = {
        full_name: '',
        description: '',
        image_url: '',
        launch_cost: '',
        maiden_flight: '',
        manufacturer: {
            id: 0,
            name: '',
            country_code: '',
        }
    };

    isOpen.value = false;
};

const handleSubmit = () => {
    rocketStore.addRocket(form.value);

    closeDialog();
}
</script>