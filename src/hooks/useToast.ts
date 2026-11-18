import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
    text: string
    color: ToastType
    timeout: number
}

export const TOAST_ICONS: Record<ToastType, string> = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    info: 'mdi-information',
    warning: 'mdi-alert',
}

export const DEFAULT_TOAST_TIMEOUT = 4000

const queue = ref<ToastItem[]>([])

function push(type: ToastType, message: string, timeout = DEFAULT_TOAST_TIMEOUT): void {
    queue.value.push({
        text: message,
        color: type,
        timeout,
    })
}

export function useToast() {
    return {
        toasts: queue,
        success: (message: string, timeout?: number) => push('success', message, timeout),
        error: (message: string, timeout?: number) => push('error', message, timeout),
        info: (message: string, timeout?: number) => push('info', message, timeout),
        warning: (message: string, timeout?: number) => push('warning', message, timeout),
        clear: (): void => {
            queue.value = []
        },
    }
}
