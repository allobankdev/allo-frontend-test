<template>
    <p v-if="loading">Loading rockets...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else>
        <v-btn class="text-none text-subtitle-1 mb-4" color="primary" size="small" variant="flat" @click="addDialog = true">
            Add
        </v-btn>
        <v-text-field
            v-model="filter"
            label="Filter"
        ></v-text-field>
        <v-table>
            <thead>
                <tr>
                    <th class="text-center">
                        Image
                    </th>
                    <th class="text-center">
                        Name
                    </th>
                    <th class="text-center">
                        Description
                    </th>
                    <th class="text-center">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in rockets" :key="item.id">
                    <td><v-img :width="300" :height="300" cover :src="resolveImage(item.flickr_images?.[0])"></v-img></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td>
                        <v-btn class="text-none text-subtitle-1" color="primary" size="small" variant="flat"
                            :to="`/rockets/${item.id}`">
                            Detail
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>

    <v-dialog
      v-model="addDialog"
      max-width="600"
    >
        <RocketAdd />
    </v-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRocket } from '@/composables/rocket'
import { ref } from 'vue'
import { watch } from 'vue'
import { useImageResolver } from "@/composables/useImageResolver";

const { resolveImage } = useImageResolver();

const filter = ref('')
const addDialog = ref(false)
const rocketStore = useRocket()
rocketStore.fetchRockets()
const { rockets, loading, error } = storeToRefs(rocketStore)
watch(filter, () => {
    rocketStore.setFilterName(filter.value)
})
</script>