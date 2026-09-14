<template>
  <v-container
    fluid
    class="py-6 px-4 px-sm-6"
    style="max-width: 600px"
  >
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      to="/"
    >
      Back to rockets
    </v-btn>

    <v-card>
      <v-card-title class="text-h5">
        Add rocket
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            label="Name"
            :rules="[v => !!v || 'Name is required']"
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            class="mb-2"
          />
          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            class="mb-2"
          />
          <v-text-field
            v-model="form.family"
            label="Family"
            class="mb-2"
          />
          <v-text-field
            v-model="form.country_code"
            label="Country code"
            class="mb-2"
          />
          <v-text-field
            v-model.number="form.launch_cost"
            label="Cost per launch"
            type="number"
            class="mb-2"
          />
          <v-text-field
            v-model="form.maiden_flight"
            label="First flight"
            type="date"
            class="mb-2"
          />
          <v-switch
            v-model="form.active"
            label="Active"
            color="primary"
            hide-details
            class="mb-2"
          />

          <v-expansion-panels>
            <v-expansion-panel title="Advanced (optional)">
              <v-expansion-panel-text>
                <v-text-field
                  v-model="form.manufacturer_name"
                  label="Manufacturer"
                  class="mb-2"
                />
                <v-text-field
                  v-model="form.variant"
                  label="Variant"
                  class="mb-2"
                />
                <v-switch
                  v-model="form.reusable"
                  label="Reusable"
                  color="primary"
                  hide-details
                  class="mb-2"
                />
                <div class="d-flex ga-2 mb-2">
                  <v-text-field
                    v-model.number="form.min_stage"
                    label="Min stage"
                    type="number"
                  />
                  <v-text-field
                    v-model.number="form.max_stage"
                    label="Max stage"
                    type="number"
                  />
                </div>
                <div class="d-flex ga-2 mb-2">
                  <v-text-field
                    v-model.number="form.length"
                    label="Length (m)"
                    type="number"
                  />
                  <v-text-field
                    v-model.number="form.diameter"
                    label="Diameter (m)"
                    type="number"
                  />
                </div>
                <v-text-field
                  v-model.number="form.launch_mass"
                  label="Launch mass (t)"
                  type="number"
                  class="mb-2"
                />
                <div class="d-flex ga-2 mb-2">
                  <v-text-field
                    v-model.number="form.leo_capacity"
                    label="LEO capacity (kg)"
                    type="number"
                  />
                  <v-text-field
                    v-model.number="form.gto_capacity"
                    label="GTO capacity (kg)"
                    type="number"
                  />
                </div>
                <div class="d-flex flex-wrap ga-2 mb-2">
                  <v-text-field
                    v-model.number="form.total_launch_count"
                    label="Total launches"
                    type="number"
                    style="min-width: 140px"
                    class="flex-grow-1"
                  />
                  <v-text-field
                    v-model.number="form.successful_launches"
                    label="Successful launches"
                    type="number"
                    style="min-width: 140px"
                    class="flex-grow-1"
                  />
                  <v-text-field
                    v-model.number="form.failed_launches"
                    label="Failed launches"
                    type="number"
                    style="min-width: 140px"
                    class="flex-grow-1"
                  />
                </div>
                <div class="d-flex ga-2 mb-2">
                  <v-text-field
                    v-model.number="form.successful_landings"
                    label="Successful landings"
                    type="number"
                  />
                  <v-text-field
                    v-model.number="form.failed_landings"
                    label="Failed landings"
                    type="number"
                  />
                </div>
                <v-text-field
                  v-model="form.wiki_url"
                  label="Wiki URL"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          to="/"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!form.full_name"
          @click="submit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRocketsStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'

  const router = useRouter()
  const rocketsStore = useRocketsStore()

  const form = reactive({
    full_name: '',
    description: '',
    image_url: '',
    family: '',
    country_code: '',
    launch_cost: null as number | null,
    maiden_flight: '',
    active: true,
    manufacturer_name: '',
    variant: '',
    reusable: false,
    min_stage: null as number | null,
    max_stage: null as number | null,
    length: null as number | null,
    diameter: null as number | null,
    launch_mass: null as number | null,
    leo_capacity: null as number | null,
    gto_capacity: null as number | null,
    total_launch_count: null as number | null,
    successful_launches: null as number | null,
    failed_launches: null as number | null,
    successful_landings: null as number | null,
    failed_landings: null as number | null,
    wiki_url: '',
  })

  async function submit () {
    if (!form.full_name) return

    if (!rocketsStore.loaded) await rocketsStore.fetchRockets()

    const rocket: Rocket = {
      id: Date.now(),
      full_name: form.full_name,
      description: form.description || null,
      image_url: form.image_url || null,
      launch_cost: form.launch_cost,
      maiden_flight: form.maiden_flight || null,
      active: form.active,
      family: form.family || null,
      reusable: form.reusable ? true : null,
      variant: form.variant || null,
      min_stage: form.min_stage,
      max_stage: form.max_stage,
      length: form.length,
      diameter: form.diameter,
      launch_mass: form.launch_mass,
      leo_capacity: form.leo_capacity,
      gto_capacity: form.gto_capacity,
      total_launch_count: form.total_launch_count,
      successful_launches: form.successful_launches,
      failed_launches: form.failed_launches,
      successful_landings: form.successful_landings,
      failed_landings: form.failed_landings,
      wiki_url: form.wiki_url || null,
      manufacturer: (form.country_code || form.manufacturer_name)
        ? { name: form.manufacturer_name || null, country_code: form.country_code || null }
        : null,
    }

    rocketsStore.addRocket(rocket)
    router.push('/')
  }
</script>
