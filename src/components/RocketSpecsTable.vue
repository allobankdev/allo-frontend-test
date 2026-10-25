<template>
  <section class="specs-section">
    <h2 class="section-heading mb-4">
      Technical Specifications
    </h2>
    <div class="specs-table-wrapper">
      <table class="specs-table">
        <tbody>
          <tr
            v-for="spec in specs"
            :key="spec.label"
          >
            <th
              scope="row"
              class="label"
            >
              {{ spec.label }}
            </th>
            <td :class="['value', spec.bold ? 'font-weight-bold' : '']">
              {{ spec.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, formatCountry } from '@/utils/formatters'

interface SpecRow {
  label: string
  value: string
  bold?: boolean
}

const props = defineProps<{
  rocket: Rocket
}>()

const specs = computed<SpecRow[]>(() => {
  const r = props.rocket
  return [
    {
      label: 'Configuration Name',
      value: r.full_name || '—',
      bold: true,
    },
    {
      label: 'Manufacturer / Agency',
      value: r.manufacturer?.name || '—',
    },
    {
      label: 'Country of Origin',
      value: formatCountry(r.manufacturer?.country_code, '—'),
    },
    {
      label: 'First Flight (Maiden)',
      value: formatDate(r.maiden_flight, '—'),
    },
    {
      label: 'Estimated Launch Cost',
      value: formatCurrency(r.launch_cost, '—'),
    },
  ]
})
</script>

<style scoped>
.section-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.specs-table-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #f1f5f9;
}

.specs-table tr:last-child {
  border-bottom: none;
}

.specs-table th,
.specs-table td {
  padding: 14px 20px;
  font-size: 14px;
  text-align: left;
}

.specs-table .label {
  width: 35%;
  color: #64748b;
  font-weight: 600;
  background-color: #fafafa;
}

.specs-table .value {
  color: #0f172a;
}

@media (max-width: 600px) {
  .specs-table .label {
    width: 45%;
  }
}
</style>
