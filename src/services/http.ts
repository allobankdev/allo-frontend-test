import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const REQUEST_TIMEOUT_MS = 10_000

export const http = axios.create({
    baseURL: API_BASE,
    timeout: REQUEST_TIMEOUT_MS,
})

function toErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return 'Unexpected error while contacting Launch Library.'
    }

    if (!error.response) {
        return 'Could not reach Launch Library. Check your connection and try again.'
    }

    const status = error.response.status
    if (status === 404) return 'This rocket does not exist.'
    if (status === 429) return 'Launch Library rate limit reached. Please wait a moment and retry.'
    if (status >= 500) return `Launch Library is having trouble (${status}). Please retry in a moment.`
    return `Request failed with status ${status}.`
}

export async function getJson<T>(
    path: string,
    params?: Record<string, string | number>,
): Promise<T> {
    try {
        const { data } = await http.get<T>(path, { params })
        return data
    } catch (error) {
        throw new Error(toErrorMessage(error))
    }
}
