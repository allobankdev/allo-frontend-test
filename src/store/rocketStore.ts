import { create } from 'zustand'
import type { Rocket } from '../types/rocket.ts'
import { fetchRockets } from '../api/rocketApi.ts'
import toast from 'react-hot-toast'

interface RocketState {
    rockets: Rocket[]
    loading: boolean
    error: string | null

    getRockets: () => Promise<void>
}

export const useRocketStore = create<RocketState>((set) => ({
    rockets: [],
    loading: false,
    error: null,

    getRockets: async () => {
        set({ loading: true, error: null })

        try {
            const rockets = await fetchRockets()
            set({ rockets, loading: false })
            toast.success('Rockets loaded successfully')
        } catch (err) {
            set({
                loading: false,
                error: 'Failed to fetch rockets. Please try again.',
            })
            toast.error('Failed to load rockets')
        }
    },

    resetError: () => set({ error: null }),
}))
