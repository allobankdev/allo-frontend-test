// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AddRocketDialog from '../rocket/AddRocketDialog.vue'
import { useRocketStore } from '@/stores/rockets'
import { useToast } from '@/hooks/useToast'

vi.mock('@/stores/rockets', () => ({
    useRocketStore: vi.fn(),
}))

vi.mock('@/hooks/useToast', () => ({
    useToast: vi.fn(),
}))

const addRocket = vi.fn()

const VForm = {
    name: 'VForm',
    template: '<form @submit.prevent><slot /></form>',
    methods: {
        validate: () => Promise.resolve({ valid: true }),
    },
}

const VTextField = {
    name: 'VTextField',
    props: ['modelValue', 'label', 'type'],
    emits: ['update:modelValue'],
    template: `
        <label>
            <span>{{ label }}</span>
            <input
                :type="type || 'text'"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </label>
    `,
}

const VTextarea = {
    name: 'VTextarea',
    props: ['modelValue', 'label'],
    emits: ['update:modelValue'],
    template: `
        <label>
            <span>{{ label }}</span>
            <textarea
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </label>
    `,
}

const VSwitch = {
    name: 'VSwitch',
    props: ['modelValue', 'label'],
    emits: ['update:modelValue'],
    template: `
        <label>
            <input
                type="checkbox"
                :checked="modelValue"
                @change="$emit('update:modelValue', $event.target.checked)"
            />
            <span>{{ label }}</span>
        </label>
    `,
}

const VBtn = {
    name: 'VBtn',
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>',
}

const stubs = {
    VDialog: { template: '<div><slot /></div>' },
    VCard: { template: '<div><slot /></div>' },
    VCardTitle: { template: '<div><slot /></div>' },
    VCardSubtitle: { template: '<div><slot /></div>' },
    VCardText: { template: '<div><slot /></div>' },
    VCardActions: { template: '<div><slot /></div>' },
    VRow: { template: '<div><slot /></div>' },
    VCol: { template: '<div><slot /></div>' },
    VSpacer: { template: '<span />' },
    VForm,
    VTextField,
    VTextarea,
    VSwitch,
    VBtn,
}

function mountDialog() {
    return mount(AddRocketDialog, {
        props: { modelValue: true, 'onUpdate:modelValue': vi.fn() },
        global: { stubs },
    })
}

async function fillRequiredFields(wrapper: ReturnType<typeof mountDialog>): Promise<void> {
    const name = wrapper.findComponent({ name: 'VTextField' })
    const description = wrapper.findComponent({ name: 'VTextarea' })

    await name.vm.$emit('update:modelValue', 'Nusantara HLV')
    await description.vm.$emit('update:modelValue', 'A medium-heavy launch vehicle.')
}

async function clickSave(wrapper: ReturnType<typeof mountDialog>): Promise<void> {
    const button = wrapper
        .findAll('button')
        .find((item) => item.text().includes('Save rocket'))

    expect(button).toBeDefined()
    await button!.trigger('click')
    await flushPromises()
}

beforeEach(() => {
    addRocket.mockReset()
    addRocket.mockImplementation((input: { name: string }) => ({
        id: 'local-test',
        name: input.name,
    }))

    vi.mocked(useRocketStore).mockReturnValue({ addRocket } as never)
    vi.mocked(useToast).mockReturnValue({
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        clear: vi.fn(),
        toasts: { value: [] },
    } as never)
})

describe('AddRocketDialog active toggle', () => {
    it('renders the toggle enabled by default', () => {
        const wrapper = mountDialog()

        expect(wrapper.text()).toContain('Active rocket')
        expect(wrapper.findComponent({ name: 'VSwitch' }).props('modelValue')).toBe(true)
    })

    it('saves a new rocket as active by default', async () => {
        const wrapper = mountDialog()
        await fillRequiredFields(wrapper)
        await clickSave(wrapper)

        expect(addRocket).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Nusantara HLV', active: true }),
        )
    })

    it('saves the rocket as inactive when the toggle is switched off', async () => {
        const wrapper = mountDialog()
        await fillRequiredFields(wrapper)

        await wrapper.findComponent({ name: 'VSwitch' }).vm.$emit('update:modelValue', false)
        await clickSave(wrapper)

        expect(addRocket).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Nusantara HLV', active: false }),
        )
    })

    it('resets the toggle back to active when the dialog is reopened', async () => {
        const wrapper = mountDialog()

        await wrapper.findComponent({ name: 'VSwitch' }).vm.$emit('update:modelValue', false)
        expect(wrapper.findComponent({ name: 'VSwitch' }).props('modelValue')).toBe(false)

        await wrapper.setProps({ modelValue: false })
        await wrapper.setProps({ modelValue: true })

        expect(wrapper.findComponent({ name: 'VSwitch' }).props('modelValue')).toBe(true)
    })
})
