<script lang="ts" setup>
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toast-notification';
import { countryOptions, statusOptions } from '@/utils/constant';
import type { RocketPayload } from '@/types/rocket';
import { useRocket } from '@/store/rocketStore';

const props = defineProps<{ isOpen: boolean }>();
const rocketStore = useRocket();
const emit = defineEmits<{
  (event: "update:isOpen", value: boolean): void;
  (event: "saved"): void;
}>();
const toast = useToast();
const showDialog = computed({
  get: () => props.isOpen,
  set: (value) => emit("update:isOpen", value),
});

const { handleSubmit, defineField, errors, resetForm, isSubmitting } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    cost_per_launch: yup.number().required('Cost per Launch is required').min(0, 'Must be a positive number'),
    country: yup.string().required('Country is required'),
    first_flight: yup.date().required('First Flight date is required'),
    active: yup.boolean().required('Status is required')
  }),
});

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [cost_per_launch, costPerLaunchAttrs] = defineField('cost_per_launch');
const [country, countryAttrs] = defineField('country');
const [first_flight, firstFlightAttrs] = defineField('first_flight');
const [active, activeAttrs] = defineField('active');

const onSubmit = handleSubmit(async (data) => {
  try {
    rocketStore.saveRockets(data as RocketPayload);
    resetForm();
    emit("saved");
    toast.success("Rocket saved");
  } catch {
    toast.error("Rocket failed to save");
  }
});

const closeDialog = () => {
  resetForm()
  emit('update:isOpen', false)
}
</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="600"
  >
    <v-card title="Add Rocket">
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                v-bind="nameAttrs"
                :error-messages="errors['name']"
                label="Name*"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="description"
                v-bind="descriptionAttrs"
                :error-messages="errors['description']"
                label="Description*"
                required
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="cost_per_launch"
                v-bind="costPerLaunchAttrs"
                :error-messages="errors['cost_per_launch']"
                label="Cost per Launch*"
                type="number"
                required
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="country"
                v-bind="countryAttrs"
                :items="countryOptions"
                :error-messages="errors['country']"
                label="Country*"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="active"
                v-bind="activeAttrs"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                :error-messages="errors['active']"
                label="Status*"
                required
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="first_flight"
                :error-messages="errors['first_flight']"
                v-bind="firstFlightAttrs"
                label="First Flight*"
                type="date"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          text="Close"
          variant="plain"
          :disabled="isSubmitting"
          @click="closeDialog"
        />

        <v-btn
          color="primary"
          :disabled="isSubmitting"
          text="Save"
          variant="tonal"
          @click="onSubmit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
