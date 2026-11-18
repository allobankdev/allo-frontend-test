import { DEFAULT_TOAST_TIMEOUT, TOAST_ICONS, useToast } from '@/hooks/useToast'
import { beforeEach, describe, expect, it } from 'vitest'

const toast = useToast()

beforeEach(() => {
    toast.clear()
})

describe('useToast', () => {
    it('queues toasts in the order they were pushed', () => {
        toast.success('Rocket added')
        toast.error('Something broke')

        expect(toast.toasts.value).toEqual([
            { text: 'Rocket added', color: 'success', timeout: DEFAULT_TOAST_TIMEOUT },
            { text: 'Something broke', color: 'error', timeout: DEFAULT_TOAST_TIMEOUT },
        ])
    })

    it('maps each toast type to a matching color and icon', () => {
        toast.success('ok')
        toast.error('nope')
        toast.info('fyi')
        toast.warning('careful')

        expect(toast.toasts.value.map((item) => item.color))
            .toEqual(['success', 'error', 'info', 'warning'])
        expect(Object.values(TOAST_ICONS)).toHaveLength(4)
    })

    it('accepts a custom timeout', () => {
        toast.info('Sticky', 8000)

        expect(toast.toasts.value[0]?.timeout).toBe(8000)
    })

    it('clears the queue', () => {
        toast.success('a')
        toast.error('b')

        toast.clear()

        expect(toast.toasts.value).toHaveLength(0)
    })
})
