import { create } from 'zustand'
import type { Rocket } from '../types/rocket.ts'

interface RocketState {
    rockets: Rocket[]
    loading: boolean
    error: string | null

    setRockets: (rockets: Rocket[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useRocketStore = create<RocketState>((set) => ({
    rockets: [],
    loading: false,
    error: null,

    setRockets: (rockets) => set({ rockets }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}))
