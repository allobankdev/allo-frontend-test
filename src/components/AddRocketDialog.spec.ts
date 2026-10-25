import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import AddRocketDialog from './AddRocketDialog.vue'
import { vuetify } from '@/test/vuetify'
import { useRocketsStore } from '@/stores/rockets'

function mountDialog () {
  const store = useRocketsStore()
  store.loaded = true

  const wrapper = mount(AddRocketDialog, {
    props: { modelValue: true },
    global: { plugins: [vuetify] },
    attachTo: document.body,
  })

  // v-dialog teleports its content to <body>, outside the wrapper's own DOM subtree.
  const body = new DOMWrapper(document.body)

  return { wrapper, body, store }
}

describe('AddRocketDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('keeps the add button disabled until a name is entered', async () => {
    const { body } = mountDialog()

    const addButton = body.findAll('button').find(b => b.text() === 'Add rocket')!
    expect(addButton.attributes('disabled')).not.toBeUndefined()

    await body.find('input[type="text"]').setValue('Custom Rocket')

    expect(addButton.attributes('disabled')).toBeUndefined()
  })

  it('adds the rocket to the store and closes on submit', async () => {
    const { wrapper, body, store } = mountDialog()

    await body.find('input[type="text"]').setValue('Custom Rocket')
    await body.findAll('button').find(b => b.text() === 'Add rocket')!.trigger('click')
    await flushPromises()

    expect(store.rockets[0]?.full_name).toBe('Custom Rocket')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
  })
})
