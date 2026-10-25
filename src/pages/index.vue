<template>
  <v-container class="page-container py-6 py-sm-10">
    <header class="mb-6">
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-5">
        <div>
          <p class="text-overline text-primary mb-1">
            Launch Library 2
          </p>
          <h1 class="text-h4 text-sm-h3 font-weight-bold">
            SpaceX rockets
          </h1>
          <p class="text-body-1 text-medium-emphasis mt-2">
            Explore past, present, and future SpaceX launch vehicles.
          </p>
        </div>

        <v-btn
          class="add-button"
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          text="Add rocket"
          @click="addDialog = true"
        />
      </div>

      <v-text-field
        v-model="search"
        aria-label="Filter rockets"
        clearable
        hide-details
        label="Filter rockets"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </header>

    <v-alert
      v-if="store.state.listRequest.status === 'error'"
      class="mb-6"
      :text="store.state.listRequest.error ?? 'Rocket data could not be loaded.'"
      title="Unable to load rockets"
      type="error"
      variant="tonal"
    >
      <template #append>
        <v-btn
          text="Retry"
          variant="outlined"
          @click="store.fetchRockets(true)"
        />
      </template>
    </v-alert>

    <div
      v-if="isInitialLoading"
      class="d-flex flex-column align-center justify-center py-16"
      role="status"
    >
      <v-progress-circular
        class="mb-4"
        color="primary"
        indeterminate
        size="48"
      />
      <span class="text-medium-emphasis">Loading rockets…</span>
    </div>

    <template v-else-if="store.state.rockets.length">
      <p
        class="text-body-2 text-medium-emphasis mb-4"
        aria-live="polite"
      >
        {{ filteredRockets.length }} {{ filteredRockets.length === 1 ? 'rocket' : 'rockets' }} found
      </p>

      <v-row v-if="filteredRockets.length">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
          sm="6"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <v-empty-state
        v-else
        icon="mdi-rocket-launch-outline"
        text="Try a different name or description."
        title="No matching rockets"
      >
        <template #actions>
          <v-btn
            text="Clear filter"
            variant="outlined"
            @click="search = ''"
          />
        </template>
      </v-empty-state>
    </template>

    <v-dialog
      v-model="addDialog"
      max-width="600"
    >
      <v-card title="Add a rocket">
        <v-form
          ref="formRef"
          @submit.prevent="submitRocket"
        >
          <v-card-text>
            <v-alert
              v-if="formError"
              class="mb-4"
              :text="formError"
              type="error"
              variant="tonal"
            />

            <v-text-field
              v-model="form.fullName"
              autofocus
              label="Rocket name"
              :rules="[requiredRule]"
            />

            <v-textarea
              v-model="form.description"
              auto-grow
              label="Description"
              rows="3"
            />

            <v-text-field
              v-model="form.imageUrl"
              label="Image URL"
              placeholder="https://example.com/rocket.jpg"
              :rules="[optionalUrlRule]"
              type="url"
            />

            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.launchCost"
                  label="Cost per launch (USD)"
                  prefix="$"
                  :rules="[optionalCostRule]"
                  type="text"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.country"
                  label="Country code"
                  placeholder="USA"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.maidenFlight"
              label="First flight"
              type="date"
            />
          </v-card-text>

          <v-card-actions class="px-6 pb-6">
            <v-spacer />
            <v-btn
              text="Cancel"
              variant="text"
              @click="addDialog = false"
            />
            <v-btn
              color="primary"
              text="Add rocket"
              type="submit"
              variant="flat"
            />
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="showAddedMessage"
      color="success"
    >
      Rocket added for this session.
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRocketStore } from '@/stores/rocketStore'
  import type { NewRocketInput } from '@/types/rocket'

  interface FormInstance {
    validate: () => Promise<{ valid: boolean }>
    resetValidation: () => void
  }

  const store = useRocketStore()
  const search = ref('')
  const addDialog = ref(false)
  const showAddedMessage = ref(false)
  const formError = ref<string | null>(null)
  const formRef = ref<FormInstance>()
  const form = reactive<NewRocketInput>(emptyForm())

  const isInitialLoading = computed(() =>
    (store.state.listRequest.status === 'idle' || store.state.listRequest.status === 'loading')
    && store.state.rockets.length === 0,
  )

  const filteredRockets = computed(() => {
    const query = search.value?.trim().toLocaleLowerCase() ?? ''
    if (!query) return store.state.rockets

    return store.state.rockets.filter(rocket =>
      rocket.fullName.toLocaleLowerCase().includes(query)
      || rocket.description?.toLocaleLowerCase().includes(query),
    )
  })

  const requiredRule = (value: string) => value.trim().length > 0 || 'Rocket name is required.'
  const optionalCostRule = (value: string) => !value || /^\d+$/.test(value) || 'Use numbers only.'
  const optionalUrlRule = (value: string) => {
    if (!value) return true

    try {
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol) || 'Use an HTTP or HTTPS URL.'
    } catch {
      return 'Enter a valid URL.'
    }
  }

  function emptyForm (): NewRocketInput {
    return {
      fullName: '',
      description: '',
      imageUrl: '',
      launchCost: '',
      country: '',
      maidenFlight: '',
    }
  }

  async function submitRocket () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    try {
      store.addRocket(form)
      Object.assign(form, emptyForm())
      formRef.value?.resetValidation()
      formError.value = null
      addDialog.value = false
      showAddedMessage.value = true
    } catch (error) {
      formError.value = error instanceof Error ? error.message : 'The rocket could not be added.'
    }
  }

  onMounted(() => store.fetchRockets())
</script>

<style scoped>
  .page-container {
    max-width: 1120px;
  }

  .add-button {
    width: 100%;
  }

  @media (min-width: 600px) {
    .add-button {
      width: auto;
    }
  }
</style>
