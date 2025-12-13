import type { Module } from 'vuex';
import type { RocketEntity } from '@/core/entities/rocket.entity';
import { RocketDetailState } from '@/pages/rockets/states/rocket-detail.state';

export interface RocketDetailStateType {
  selectedRocket: RocketEntity | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export const rocketDetailModule: Module<RocketDetailStateType, any> = {
  namespaced: true,
  state: () => new RocketDetailState(),
  mutations: {
    SET_LOADING(state) {
      state.errorMessage = '';
      state.isLoading = true;
      state.isError = false;
    },
    SET_ERROR(state, errorMessage: string) {
      state.errorMessage = errorMessage;
      state.isLoading = false;
      state.isError = true;
    },
    SET_SUCCESS(state) {
      state.errorMessage = '';
      state.isLoading = false;
      state.isError = false;
    },
    SET_ROCKET(state, rocket: RocketEntity) {
      state.selectedRocket = rocket;
    },
    CLEAR_ROCKET(state) {
      state.selectedRocket = null;
    },
    RESET(state) {
      Object.assign(state, new RocketDetailState());
    },
  },
  actions: {
    markAsLoading({ commit }) {
      commit('SET_LOADING');
    },
    markAsError({ commit }, errorMessage: string) {
      commit('SET_ERROR', errorMessage);
    },
    markAsSuccess({ commit }) {
      commit('SET_SUCCESS');
    },
    loadRocket({ commit }, rocket: RocketEntity) {
      commit('SET_ROCKET', rocket);
    },
    clearRocket({ commit }) {
      commit('CLEAR_ROCKET');
    },
    reset({ commit }) {
      commit('RESET');
    },
  },
  getters: {
    selectedRocket: state => state.selectedRocket,
    isLoading: state => state.isLoading,
    isError: state => state.isError,
    errorMessage: state => state.errorMessage,
  },
};
