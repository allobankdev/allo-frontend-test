/**
 * composables/useRocketForm.ts
 *
 * Form state, validation and mapping to `NewRocketInput` for the Add Rocket dialog.
 * All inputs are kept as strings and converted only on submit.
 */

import { computed, reactive, ref } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

export interface RocketFormValues {
  // Basic information
  name: string
  description: string
  imageUrl: string
  family: string
  variant: string
  // Key facts
  country: string
  launchCost: string
  firstFlight: string
  manufacturer: string
  status: '' | 'active' | 'retired'
  reusability: '' | 'reusable' | 'expendable'
  // Specifications
  length: string
  diameter: string
  launchMass: string
  leoCapacity: string
  gtoCapacity: string
  thrust: string
  minStage: string
  maxStage: string
  // Links
  wikiUrl: string
  infoUrl: string
}

export type RocketFormErrors = Partial<Record<keyof RocketFormValues, string>>

/** Positive decimal spec fields, with the unit shown in labels and errors. */
export const DECIMAL_SPEC_FIELDS = [
  { key: 'length', label: 'Height', unit: 'm', placeholder: '70' },
  { key: 'diameter', label: 'Diameter', unit: 'm', placeholder: '3.7' },
  { key: 'launchMass', label: 'Launch mass', unit: 't', placeholder: '549' },
  { key: 'leoCapacity', label: 'Payload to LEO', unit: 'kg', placeholder: '22800' },
  { key: 'gtoCapacity', label: 'Payload to GTO', unit: 'kg', placeholder: '8300' },
  { key: 'thrust', label: 'Liftoff thrust', unit: 'kN', placeholder: '7607' },
] as const satisfies ReadonlyArray<{ key: keyof RocketFormValues, label: string, unit: string, placeholder: string }>

const URL_FIELDS = ['imageUrl', 'wikiUrl', 'infoUrl'] as const satisfies ReadonlyArray<keyof RocketFormValues>
const STAGE_FIELDS = ['minStage', 'maxStage'] as const satisfies ReadonlyArray<keyof RocketFormValues>
const MAX_STAGES = 10

function createEmptyValues (): RocketFormValues {
  return {
    name: '',
    description: '',
    imageUrl: '',
    family: '',
    variant: '',
    country: '',
    launchCost: '',
    firstFlight: '',
    manufacturer: '',
    status: '',
    reusability: '',
    length: '',
    diameter: '',
    launchMass: '',
    leoCapacity: '',
    gtoCapacity: '',
    thrust: '',
    minStage: '',
    maxStage: '',
    wikiUrl: '',
    infoUrl: '',
  }
}

function isHttpUrl (value: string): boolean {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

/** Accepts "50000000", "50,000,000" or "50 000 000". Returns NaN when invalid. */
function parseNumber (value: string): number {
  const normalized = value.trim().replace(/[,\s]/g, '')
  return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN
}

/** `null` for an empty field, otherwise the parsed number. Call only after validation. */
function toNumber (value: string): number | null {
  return value.trim() ? parseNumber(value) : null
}

function toText (value: string): string | null {
  return value.trim() || null
}

function toBoolean<T extends string> (value: T | '', truthy: T): boolean | null {
  return value === '' ? null : value === truthy
}

export function validateRocketForm (values: RocketFormValues): RocketFormErrors {
  const errors: RocketFormErrors = {}

  if (!values.name.trim()) errors.name = 'Rocket name is required.'
  if (!values.description.trim()) errors.description = 'Description is required.'

  for (const key of URL_FIELDS) {
    const url = values[key].trim()
    if (url && !isHttpUrl(url)) errors[key] = 'Enter a valid URL starting with http:// or https://.'
  }

  const country = values.country.trim()
  if (country && !/^[a-z]{2,3}$/i.test(country)) errors.country = 'Use a 2–3 letter country code, e.g. USA.'

  if (values.launchCost.trim() && !(parseNumber(values.launchCost) > 0)) {
    errors.launchCost = 'Launch cost must be a positive number.'
  }

  if (values.firstFlight && Number.isNaN(Date.parse(values.firstFlight))) {
    errors.firstFlight = 'Enter a valid date.'
  }

  for (const { key, label } of DECIMAL_SPEC_FIELDS) {
    if (values[key].trim() && !(parseNumber(values[key]) > 0)) errors[key] = `${label} must be a positive number.`
  }

  for (const key of STAGE_FIELDS) {
    const raw = values[key].trim()
    const stages = parseNumber(raw)
    if (raw && !(Number.isInteger(stages) && stages >= 1 && stages <= MAX_STAGES)) {
      errors[key] = `Use a whole number from 1 to ${MAX_STAGES}.`
    }
  }

  const minStage = toNumber(values.minStage)
  const maxStage = toNumber(values.maxStage)
  if (!errors.minStage && !errors.maxStage && minStage !== null && maxStage !== null && minStage > maxStage) {
    errors.maxStage = 'Max stages must be greater than or equal to min stages.'
  }

  return errors
}

export function toNewRocketInput (values: RocketFormValues): NewRocketInput {
  const manufacturerName = toText(values.manufacturer)

  return {
    name: values.name.trim(),
    description: values.description.trim(),
    imageUrl: toText(values.imageUrl),
    country: toText(values.country)?.toUpperCase() ?? null,
    launchCost: toNumber(values.launchCost),
    firstFlight: values.firstFlight || null,
    family: toText(values.family),
    variant: toText(values.variant),
    active: toBoolean(values.status, 'active'),
    reusable: toBoolean(values.reusability, 'reusable'),
    wikiUrl: toText(values.wikiUrl),
    infoUrl: toText(values.infoUrl),
    manufacturer: manufacturerName
      ? {
        name: manufacturerName,
        abbrev: null,
        type: null,
        description: null,
        administrator: null,
        foundingYear: null,
        logoUrl: null,
        infoUrl: null,
        wikiUrl: null,
      }
      : null,
    specs: {
      length: toNumber(values.length),
      diameter: toNumber(values.diameter),
      launchMass: toNumber(values.launchMass),
      leoCapacity: toNumber(values.leoCapacity),
      gtoCapacity: toNumber(values.gtoCapacity),
      thrust: toNumber(values.thrust),
      minStage: toNumber(values.minStage),
      maxStage: toNumber(values.maxStage),
    },
  }
}

export function useRocketForm () {
  const values = reactive<RocketFormValues>(createEmptyValues())
  /** Errors are shown only after the first submit attempt, then update live. */
  const submitted = ref(false)

  const errors = computed<RocketFormErrors>(() => validateRocketForm(values))
  const visibleErrors = computed<RocketFormErrors>(() => (submitted.value ? errors.value : {}))
  const isValid = computed(() => Object.keys(errors.value).length === 0)

  function reset (): void {
    Object.assign(values, createEmptyValues())
    submitted.value = false
  }

  /** Marks the form as submitted and returns the payload, or `null` when invalid. */
  function submit (): NewRocketInput | null {
    submitted.value = true
    return isValid.value ? toNewRocketInput(values) : null
  }

  return { values, errors, visibleErrors, isValid, reset, submit }
}
