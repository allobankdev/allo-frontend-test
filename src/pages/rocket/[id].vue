<template>
  <v-container class="py-8">
    <div class="d-flex flex-column ga-6">
      <div class="d-flex align-center ga-3">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/"
        >
          Kembali
        </v-btn>
        <h1 class="text-h5 font-weight-bold">
          Detail Rocket
        </h1>
      </div>

      <UiState
        :status="store.state.status"
        :error="store.state.error"
        :retrying="isRetrying"
        @retry="onRetry"
      >
        <v-alert
          v-if="isNotFound"
          type="warning"
          variant="tonal"
        >
          Rocket dengan id tersebut tidak ditemukan.
        </v-alert>

        <v-card
          v-else-if="rocket"
          variant="outlined"
        >
          <v-img
            :src="rocket.image || fallbackImage"
            height="340"
            cover
          />

          <v-card-item>
            <v-card-title class="text-h5">
              {{ rocket.name }}
            </v-card-title>
            <v-card-subtitle>{{ rocket.country }}</v-card-subtitle>
            <template #append>
              <div class="d-flex ga-2">
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-pencil"
                  @click="openEditDialog"
                >
                  Edit
                </v-btn>
                <v-btn
                  color="error"
                  variant="tonal"
                  prepend-icon="mdi-delete"
                  @click="openDeleteDialog"
                >
                  Hapus
                </v-btn>
              </div>
            </template>
          </v-card-item>

          <v-card-text>
            <p class="text-body-1 mb-6">
              {{ rocket.description }}
            </p>

            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <div class="text-caption text-medium-emphasis">
                  Cost Per Launch
                </div>
                <div class="text-body-1 font-weight-bold">
                  {{ formatCurrency(rocket.costPerLaunch) }}
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <div class="text-caption text-medium-emphasis">
                  Country
                </div>
                <div class="text-body-1 font-weight-bold">
                  {{ rocket.country }}
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <div class="text-caption text-medium-emphasis">
                  First Flight
                </div>
                <div class="text-body-1 font-weight-bold">
                  {{ formatDate(rocket.firstFlight) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </UiState>
    </div>
  </v-container>

  <v-dialog
    v-model="isEditOpen"
    max-width="720"
  >
    <v-card>
      <v-card-title class="text-h6">
        Edit Rocket
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveEdit">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editForm.name"
                label="Nama Rocket"
                :error-messages="editErrors.name"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="editForm.image"
                label="URL Gambar"
                placeholder="https://..."
                :error-messages="editErrors.image"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="editForm.description"
                label="Deskripsi"
                rows="3"
                :error-messages="editErrors.description"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model.number="editForm.costPerLaunch"
                label="Cost Per Launch"
                type="number"
                min="0"
                :error-messages="editErrors.costPerLaunch"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="editForm.country"
                label="Country"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="editForm.firstFlight"
                label="First Flight"
                placeholder="YYYY-MM-DD"
                :error-messages="editErrors.firstFlight"
              />
            </v-col>
          </v-row>

          <div class="d-flex ga-2 justify-end mt-2">
            <v-btn
              variant="text"
              @click="closeEditDialog"
            >
              Batal
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
            >
              Simpan
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="isDeleteOpen"
    max-width="480"
  >
    <v-card>
      <v-card-title class="text-h6">
        Hapus Rocket?
      </v-card-title>
      <v-card-text>
        Data rocket yang dihapus tidak bisa dikembalikan.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="text"
          :disabled="isDeleting"
          @click="isDeleteOpen = false"
        >
          Batal
        </v-btn>
        <v-btn
          color="error"
          :loading="isDeleting"
          :disabled="isDeleting"
          @click="confirmDelete"
        >
          Ya, Hapus
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import UiState from '@/components/UiState.vue'
  import { useRocketStore } from '@/store/rocketStore'

  const fallbackImage = 'https://images2.imgbox.com/9a/96/nLppz9HW_o.png'
  const store = useRocketStore()
  const route = useRoute()
  const router = useRouter()

  const rocketId = computed(() => {
    const params = route.params as Record<string, string | string[] | undefined>
    const raw = params.id
    if (Array.isArray(raw)) return raw[0]
    return raw
  })

  const rocket = computed(() => store.selectedRocket.value)
  const isRetrying = ref(false)
  const isEditOpen = ref(false)
  const isDeleteOpen = ref(false)
  const isDeleting = ref(false)

  const editForm = reactive({
    name: '',
    description: '',
    image: '',
    costPerLaunch: 0,
    country: '',
    firstFlight: '',
  })

  const editErrors = reactive<Record<string, string[]>>({
    name: [],
    description: [],
    image: [],
    costPerLaunch: [],
    firstFlight: [],
  })

  const isNotFound = computed(() => {
    return store.state.status === 'success' && !rocket.value
  })

  async function prepare() {
    if (store.state.status === 'idle' || store.state.status === 'error') {
      await store.fetchRockets()
    }

    store.setSelectedRocketById(rocketId.value ?? null)
  }

  async function onRetry() {
    isRetrying.value = true
    try {
      await prepare()
    } finally {
      isRetrying.value = false
    }
  }

  function openEditDialog() {
    if (!rocket.value) return

    clearEditErrors()
    editForm.name = rocket.value.name
    editForm.description = rocket.value.description
    editForm.image = rocket.value.image ?? ''
    editForm.costPerLaunch = rocket.value.costPerLaunch
    editForm.country = rocket.value.country
    editForm.firstFlight = rocket.value.firstFlight
    isEditOpen.value = true
  }

  function closeEditDialog() {
    isEditOpen.value = false
  }

  function saveEdit() {
    if (!rocket.value) return
    if (!validateEditForm()) return

    store.updateRocket({
      id: rocket.value.id,
      name: editForm.name,
      description: editForm.description,
      image: editForm.image,
      costPerLaunch: Number(editForm.costPerLaunch) || 0,
      country: editForm.country,
      firstFlight: editForm.firstFlight,
    })

    isEditOpen.value = false
  }

  function openDeleteDialog() {
    if (!rocket.value) return
    isDeleteOpen.value = true
  }

  async function confirmDelete() {
    if (!rocket.value) return

    isDeleting.value = true
    try {
      store.deleteRocket(rocket.value.id)
      isDeleteOpen.value = false
      await router.push('/')
    } finally {
      isDeleting.value = false
    }
  }

  function clearEditErrors() {
    editErrors.name = []
    editErrors.description = []
    editErrors.image = []
    editErrors.costPerLaunch = []
    editErrors.firstFlight = []
  }

  function validateEditForm() {
    clearEditErrors()
    let valid = true

    if (!editForm.name.trim()) {
      editErrors.name = ['Nama rocket wajib diisi.']
      valid = false
    }

    if (!editForm.description.trim()) {
      editErrors.description = ['Deskripsi rocket wajib diisi.']
      valid = false
    }

    if (editForm.image.trim() && !isValidUrl(editForm.image.trim())) {
      editErrors.image = ['URL gambar tidak valid. Gunakan format http:// atau https://']
      valid = false
    }

    const cost = Number(editForm.costPerLaunch)
    if (!Number.isFinite(cost) || cost < 0) {
      editErrors.costPerLaunch = ['Cost Per Launch harus angka nol atau lebih besar.']
      valid = false
    }

    if (editForm.firstFlight.trim() && !isValidDateFormat(editForm.firstFlight.trim())) {
      editErrors.firstFlight = ['Format tanggal harus YYYY-MM-DD dan tanggal valid.']
      valid = false
    }

    return valid
  }

  function isValidUrl(value: string) {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  function isValidDateFormat(value: string) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!datePattern.test(value)) return false

    const parsed = new Date(`${value}T00:00:00Z`)
    if (Number.isNaN(parsed.getTime())) return false

    return parsed.toISOString().startsWith(value)
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate(date: string) {
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return date

    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
    }).format(parsed)
  }

  onMounted(prepare)

  watch(
    () => route.fullPath,
    () => {
      void prepare()
    },
  )
</script>
