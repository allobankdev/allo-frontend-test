<template>
    <v-dialog v-model="open" max-width="500">

        <template #activator="{ props }">
            <v-btn v-bind="props" color="primary">Tambah Rocket</v-btn>
        </template>

        <v-card>
            <v-card-title>Tambah Rocket</v-card-title>

            <v-card-text>
                <v-text-field v-model="name" label="Nama Rocket" />
                <v-textarea v-model="description" label="Deskripsi" />
                <v-text-field v-model="image" label="URL Gambar" />
            </v-card-text>

            <v-card-actions>
                <v-btn text @click="open = false">Batal</v-btn>
                <v-btn color="primary" @click="submit">Simpan</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['add'])

const open = ref(false)
const name = ref('')
const description = ref('')
const image = ref('')

function submit() {
    emit('add', {
        id: Date.now().toString(),
        name: name.value,
        description: description.value,
        flickr_images: [image.value || 'https://via.placeholder.com/300']
    })

    // reset form
    name.value = ''
    description.value = ''
    image.value = ''
    open.value = false
}
</script>