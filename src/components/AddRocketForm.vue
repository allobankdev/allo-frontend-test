<template>
  <v-btn
    color="primary"
    prepend-icon="mdi-plus"
    @click="open"
  >
    Add rocket
  </v-btn>

  <v-dialog
    v-model="dialog"
    max-width="480"
  >
    <v-card rounded="lg">
      <v-card-title>Add new rocket</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            label="Rocket name"
            :rules="[required]"
            class="mb-2"
          />
          <v-textarea
            v-model="description"
            label="Description"
            :rules="[required]"
            class="mb-2"
          />
          <v-text-field
            v-model="image"
            label="Image URL (optional)"
            class="mb-2"
          />
          <v-btn
            color="primary"
            @click="submit"
          >
            Add rocket
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="text"
        @click="close"
      >
        Close
      </v-btn>
      <v-btn
        color="primary"
        @click="submit"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-dialog>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { useRockets } from '@/stores/rockets';

const { addRocket } = useRockets();

const dialog = ref(false);
const form = ref();
const name = ref('');
const description = ref('');
const image = ref('');

const required = (value : string) => !!value.trim() || 'Required';

function close(){
    dialog.value = false;
    reset()
}
function open(){
    dialog.value = true;
}

function reset(){
    name.value = '';
    description.value = '';
    image.value = '';
    form.value?.resetValidation()
}

async function submit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  addRocket(
    name.value.trim(),
    description.value.trim(),
    image.value.trim() || null,
  )

  close()
}
</script>