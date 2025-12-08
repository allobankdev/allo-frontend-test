<script setup lang="ts">
import { ref } from 'vue'

const status = ref('') 
const fromDate = ref('')
const toDate = ref('')

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'apply', filters: { from?: Date; to?: Date; status: string }): void
  (e: 'close'): void
}>()

const closeDropdown = () => {
  emit('close')
}

const resetDropdown = () => {
  fromDate.value = ''
  toDate.value = ''
  status.value = ''
}

const submitButton = () => {
  emit('apply',  {
    status: status.value,
    from: fromDate.value ? new Date(fromDate.value) : undefined,
    to: toDate.value ? new Date(toDate.value) : undefined
  })
  closeDropdown()
}
</script>

<template>
  <div class="dropdown-filter-menu">
    <div class="dropdown-filter-menu-header">
        <button class="button-reset" @click="resetDropdown">Reset</button>
        <h5>Filters</h5>
    </div>
    <div class ="dropdown-filter-menu-content">
        <p class="header-title">Date Range</p>
        <div class="date-section">
            <div class="date-group">
                <label class="date-header" for="from-date">From</label>
                <input id="from-date" type="date" class="input-filter" v-model="fromDate"/>
            </div>
            <div class="date-group">
                <label class="date-header" for="to-date">To</label>
                <input id="to-date" type="date" class="input-filter" v-model="toDate"/>
            </div>
        </div>
         <p class="header-title">Status</p>
         <div class="status-section">
            <select class="input-filter" v-model="status">
            <option value="">All</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            </select>
        </div>
    </div>

    <button class="button-close" @click="closeDropdown">Close</button>
    <button class="button-apply" @click="submitButton">Apply</button>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-filter-menu {
  position: absolute;
  top: 48px;
  right: 0;
  width: 400px;
  background: white;
  color: black;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  z-index: 9999;
}

.dropdown-filter-menu-header {
  padding-bottom: 8px;
  margin-bottom: 12px;
  text-align: center;
}

.dropdown-filter-menu-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  width: 100%
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

.button-reset {
  padding: 0px 16px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background-color: transparent;
  left: 0;
  position: absolute;
  font-size: 12px;
  color: darkred;
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
</style>
