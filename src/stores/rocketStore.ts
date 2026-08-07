import { defineStore } from "pinia";
import type { RocketData } from '@/types/types';
import axios from 'axios';

export const useRocketStore = defineStore('rocketStore', {
    state: () => ({
        data: null as RocketData | null,
        loading: false,
        exception: '',
    }),
    actions: {
        async getData() {
            this.loading = true
            this.exception = ''

            try {
                const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed')
                this.data = res.data
            } catch (error) {
                if (error instanceof Error) {
                    this.exception = 'Get data failed: ' + error.message
                } else {
                    this.exception = 'Unknown error: ' + error
                }
            } finally {
                this.loading = false
            }
        }
    }
})
