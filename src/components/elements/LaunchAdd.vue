<script setup lang="ts">
import { ref } from 'vue'
  
const file = ref<File | null>(null)
const preview = ref<string | null>(null)

const form = ref({
    fairings: '',
    links: {
        patch: {
            small: '',
            large: ''
        },
        reddit: {
            campaign: '',
            launch: '',
            media: '',
            recovery: '',
        },
        flickr: {
            small: [],
            original: []
        },
        presskit: '',
        webcast: '',
        youtube_id: '',
        article: '',
        wikipedia: '',
    },
    static_fire_date_utc: '',
    static_fire_date_unix: 0,
    net: false,
    window: 0,
    rocket: '',
    success: false,
    failures: [],
    details: '',
    crew: [],
    ships: [],
    capsules: [],
    payloads: [],
    launchpad: '',
    flight_number: 0,
    name: '',
    date_utc: '',
    date_unix: '',
    date_local: '',
    date_precision: '',
    upcoming: false,
    cores: [
        {
            core: '',
            flight: 0,
            gridfins: false,
            legs: false,
            reused: false,
            landing_attempt: false,
            landing_success: false,
            landing_type: '',
            landpad: ''
        }
    ],
    auto_update: false,
    tbd: false,
    launch_library_id: '',
    id: ''
})

const { show } = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const resetForm = () => {
  form.value = {
    fairings: '',
    links: {
        patch: {
            small: '',
            large: ''
        },
        reddit: {
            campaign: '',
            launch: '',
            media: '',
            recovery: '',
        },
        flickr: {
            small: [],
            original: []
        },
        presskit: '',
        webcast: '',
        youtube_id: '',
        article: '',
        wikipedia: '',
    },
    static_fire_date_utc: '',
    static_fire_date_unix: 0,
    net: false,
    window: 0,
    rocket: '',
    success: false,
    failures: [],
    details: '',
    crew: [],
    ships: [],
    capsules: [],
    payloads: [],
    launchpad: '',
    flight_number: 0,
    name: '',
    date_utc: '',
    date_unix: '',
    date_local: '',
    date_precision: '',
    upcoming: false,
    cores: [
        {
            core: '',
            flight: 0,
            gridfins: false,
            legs: false,
            reused: false,
            landing_attempt: false,
            landing_success: false,
            landing_type: '',
            landpad: ''
        }
    ],
    auto_update: false,
    tbd: false,
    launch_library_id: '',
    id: ''
  }

  preview.value = null
  file.value = null
}

const closeModal = () => {
  resetForm()
  emit('close')
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  file.value = target.files[0]

  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result as string
    form.value.links.patch.small = e.target?.result as string
    form.value.links.patch.large = e.target?.result as string
  }
  reader.readAsDataURL(file.value)
}

const STORAGE_KEY = 'rocket-form-data'

function submitForm() {
  if (form.value.name.length > 0 && form.value.details.length > 0 && form.value.links.patch.small.length > 0){ 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
    alert('Saved to Local Storage!')
    resetForm()
    emit('close')
  } else {
    alert('Please complete all the required fields')
  }
}
</script>

<template>
  <div v-if="show" class="dropdown-filter-menu">
    <div class="dropdown-filter-menu-header">
        <h5>Add New Form</h5>
    </div>
    <div class ="dropdown-filter-menu-content">
        <p class="header-title">Rocket Name <span class="required">*</span></p>
        <input class="input-filter" type="text" v-model="form.name" required/>
        <p class="header-title">Rocket Descriptions <span class="required">*</span></p>
        <input class="input-filter" type="text" v-model="form.details"/>
        <p class="header-title">Flight Number</p>
        <input class="input-filter" type="number" v-model="form.flight_number"/>
        <p class="header-title">Window</p>
        <input class="input-filter" type="number" v-model="form.window"/>
        <p class="header-title">Crew</p>
        <input class="input-filter" type="text" v-model="form.crew"/>
        <p class="header-title">Ships</p>
        <input class="input-filter" type="text" v-model="form.ships"/>
        <p class="header-title">Date</p>
        <input id="from-date" type="date" class="input-filter" v-model="form.date_utc"/>
        <p class="header-title">Status</p>
        <div class="radio-group">
          <label class="radio-label">
            <input
              type="radio"
              name="status"
              :value="true"
              v-model="form.success"
            />
            Successful
          </label>

          <label class="radio-label">
            <input
              type="radio"
              name="status"
              :value="false"
              v-model="form.success"
            />
            Failed
          </label>
        </div>
        <p class="header-title">Upcoming</p>
        <div class="radio-group">
          <label class="radio-label">
            <input
              type="radio"
              name="status"
              :value="true"
              v-model="form.upcoming"
            />
            Yes
          </label>

          <label class="radio-label">
            <input
              type="radio"
              name="status"
              :value="false"
              v-model="form.upcoming"
            />
            No
          </label>
        </div>
        <p class="header-title">Image <span class="required">*</span></p>
        <input type="file" accept="image/*" @change="onFileChange" />
        <p v-if="preview">Preview:</p>
        <img
          v-if="preview"
          :src="preview"
          alt="Image preview"
          style="max-width: 200px; max-height: 200px;"
        >
    </div>

    <button class="button-close" @click="closeModal">Close</button>
    <button class="button-apply" @click="submitForm">Submit</button>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-filter-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;  
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow-y: auto;
}

.dropdown-filter-menu-header {
  padding-bottom: 8px;
  margin-bottom: 12px;
  text-align: center;
}

.dropdown-filter-menu-content {
  position: relative;
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
}

.header-title {
  font-size: 14px;
  padding-top: 10px;
  padding-bottom: 4px;
  border-top: 1px solid #ccc;
}

.date-section {
  display: flex;
  gap: 8px;
}

.date-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.date-header {
  font-size: 12px;
  color: dimgray;
  margin-bottom: 4px;
}

.input-filter{
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ccc;
  color: black;
}

.button-close {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background-color: dimgray;
  color: white;
}

.button-close:hover {
  background-color: gray;
  transform: scale(1.05);
}

.button-apply {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background-color: dimgray;
  color: white;
  right: 0;
  position: absolute;
  margin-right: 15px;
}

.button-apply:hover {
  background-color: gray;
  transform: scale(1.05);
}

.radio-label {
  padding-left: 10px;
}

.required {
  color: red;
}
</style>