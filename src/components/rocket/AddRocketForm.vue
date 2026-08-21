<template>
  <!-- Trigger button -->
  <button class="add-btn" @click="open = true">
    <v-icon size="18">mdi-plus</v-icon>
    <span>Tambah Roket</span>
  </button>

  <!-- Dialog -->
  <v-dialog v-model="open" max-width="540" :persistent="submitting">
    <div class="add-dialog glass-card" style="border-radius: 20px; overflow: hidden">
      <!-- Header -->
      <div class="add-dialog__header">
        <div class="add-dialog__header-icon">
          <v-icon color="primary" size="22">mdi-rocket-launch</v-icon>
        </div>
        <div>
          <h2 class="text-body-1 font-weight-bold text-white">Tambah Roket Baru</h2>
          <p class="text-caption text-medium-emphasis mt-0">Data tersimpan hanya pada sesi ini.</p>
        </div>
        <button class="add-dialog__close" @click="onClose">
          <v-icon size="20" color="medium-emphasis">mdi-close</v-icon>
        </button>
      </div>

      <div class="add-dialog__divider" />

      <!-- Form -->
      <v-form ref="formRef" v-model="isValid" class="add-dialog__body" @submit.prevent="onSubmit">
        <!-- Full Name -->
        <div class="form-group">
          <label class="form-label">Nama Roket <span class="required">*</span></label>
          <input
            v-model="form.full_name"
            type="text"
            class="form-input"
            :class="{ 'form-input--error': showErrors && !form.full_name.trim() }"
            placeholder="e.g. Falcon 9 Block 5"
          />
          <span v-if="showErrors && !form.full_name.trim()" class="form-error">Wajib diisi</span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Deskripsi</label>
          <textarea
            v-model="form.description"
            class="form-input form-textarea"
            placeholder="Deskripsi singkat tentang roket ini…"
            rows="3"
          />
        </div>

        <!-- Row: Cost + Country -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Biaya Peluncuran (USD)</label>
            <input
              v-model="form.launch_cost"
              type="number"
              class="form-input"
              placeholder="62000000"
              min="0"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Kode Negara</label>
            <input
              v-model="form.country_code"
              type="text"
              class="form-input"
              placeholder="USA"
              maxlength="5"
            />
          </div>
        </div>

        <!-- Row: Maiden flight + Manufacturer -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Penerbangan Perdana</label>
            <input
              v-model="form.maiden_flight"
              type="date"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Manufaktur</label>
            <input
              v-model="form.manufacturer_name"
              type="text"
              class="form-input"
              placeholder="SpaceX"
            />
          </div>
        </div>

        <!-- Image URL -->
        <div class="form-group">
          <label class="form-label">URL Gambar</label>
          <input
            v-model="form.image_url"
            type="url"
            class="form-input"
            placeholder="https://example.com/rocket.jpg"
          />
        </div>

        <div class="add-dialog__divider" />

        <!-- Actions -->
        <div class="add-dialog__actions">
          <button type="button" class="action-btn action-btn--cancel" @click="onClose">
            Batal
          </button>
          <button type="submit" class="action-btn action-btn--submit" :disabled="submitting">
            <v-icon v-if="submitting" size="16" class="spin">mdi-loading</v-icon>
            <span>{{ submitting ? 'Menyimpan…' : 'Simpan Roket' }}</span>
          </button>
        </div>
      </v-form>
    </div>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'

const store = useRocketStore()

const open = ref(false)
const isValid = ref(false)
const submitting = ref(false)
const showErrors = ref(false)
const formRef = ref()

interface FormData {
  full_name: string
  description: string
  launch_cost: string
  country_code: string
  maiden_flight: string
  manufacturer_name: string
  image_url: string
}

const defaultForm = (): FormData => ({
  full_name: '',
  description: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
  manufacturer_name: '',
  image_url: '',
})

const form = reactive<FormData>(defaultForm())

function buildRocket(): Rocket {
  return {
    id: Date.now(),
    url: '',
    full_name: form.full_name.trim(),
    family: '',
    variant: '',
    alias: '',
    min_stage: null,
    max_stage: null,
    length: null,
    diameter: null,
    maiden_flight: form.maiden_flight || null,
    launch_cost: form.launch_cost || null,
    mass_to_leo: null,
    mass_to_gto: null,
    mass_to_other: null,
    leo_capacity: null,
    gto_capacity: null,
    to_thrust: null,
    apogee: null,
    vac_thrust: null,
    total_launch_count: 0,
    consecutive_successful_launches: 0,
    successful_launches: 0,
    failed_launches: 0,
    pending_launches: 0,
    attempted_landings: 0,
    successful_landings: 0,
    failed_landings: 0,
    consecutive_successful_landings: 0,
    image_url: form.image_url || null,
    info_url: null,
    wiki_url: null,
    description: form.description || null,
    manufacturer: form.manufacturer_name || form.country_code
      ? {
          id: 0, url: '', name: form.manufacturer_name, type: '',
          country_code: form.country_code.toUpperCase(),
          abbrev: '', description: null, administrator: null, founding_year: null,
          launchers: '', spacecraft: '', image_url: null, logo_url: null,
          wiki_url: null, info_url: null, total_launch_count: 0,
          consecutive_successful_launches: 0, successful_launches: 0,
          failed_launches: 0, pending_launches: 0, attempted_landings: 0,
          successful_landings: 0, failed_landings: 0, consecutive_successful_landings: 0,
        }
      : null,
    program: [],
    isLocal: true,
  }
}

async function onSubmit() {
  showErrors.value = true
  if (!form.full_name.trim()) return

  submitting.value = true
  await new Promise(r => setTimeout(r, 400))
  store.addLocalRocket(buildRocket())
  submitting.value = false
  // Close after brief delay to let Pinia update propagate
  await new Promise(r => setTimeout(r, 50))
  onClose()
}

function onClose() {
  open.value = false
  showErrors.value = false
  Object.assign(form, defaultForm())
}
</script>

<style scoped>
/* ── Trigger ── */
.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4F8EF7, #22D3EE);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.add-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.add-btn:active { transform: translateY(0); }

/* ── Dialog shell ── */
.add-dialog__header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px 16px;
}
.add-dialog__header-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(79,142,247,0.12);
  border: 1px solid rgba(79,142,247,0.25);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.add-dialog__close {
  margin-left: auto; background: none; border: none;
  cursor: pointer; display: flex; align-items: center;
  padding: 4px; border-radius: 6px;
  transition: background 0.15s;
}
.add-dialog__close:hover { background: rgba(255,255,255,0.06); }

.add-dialog__divider {
  height: 1px; background: rgba(255,255,255,0.06); margin: 0;
}

.add-dialog__body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.add-dialog__actions {
  display: flex; justify-content: flex-end; gap: 10px; padding: 0;
}

/* ── Form elements ── */
.form-group { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.form-row { display: flex; gap: 14px; }
@media (max-width: 480px) { .form-row { flex-direction: column; } }

.form-label {
  font-size: 0.78rem; font-weight: 600;
  color: rgba(226,232,240,0.65); text-transform: uppercase; letter-spacing: 0.04em;
}
.required { color: #EF4444; }

.form-input {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px;
  padding: 0 12px;
  height: 40px;
  color: #E2E8F0;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: rgba(79,142,247,0.6);
  background: rgba(79,142,247,0.04);
}
.form-input--error { border-color: rgba(239,68,68,0.6) !important; }

.form-textarea {
  height: auto;
  padding: 10px 12px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* fix date input on dark background */
input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }

.form-error { font-size: 0.72rem; color: #EF4444; }

/* ── Action buttons ── */
.action-btn {
  height: 40px; padding: 0 20px; border-radius: 9px;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  border: none; display: flex; align-items: center; gap: 6px;
  transition: all 0.18s ease;
}
.action-btn--cancel {
  background: rgba(255,255,255,0.06);
  color: rgba(226,232,240,0.65);
}
.action-btn--cancel:hover { background: rgba(255,255,255,0.10); }
.action-btn--submit {
  background: linear-gradient(135deg, #4F8EF7, #22D3EE);
  color: #fff;
}
.action-btn--submit:hover { opacity: 0.9; }
.action-btn--submit:disabled { opacity: 0.5; cursor: not-allowed; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
