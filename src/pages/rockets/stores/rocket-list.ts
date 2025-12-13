import type { Module } from 'vuex';
import type { RocketEntity } from '@/core/entities/rocket.entity';
import { RocketListState } from '@/pages/rockets/states/rocket-list.state';

export interface RocketListStateType {
  rockets: RocketEntity[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}

export const rocketListModule: Module<RocketListStateType, any> = {
  namespaced: true,
  state: () => new RocketListState(),
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
    SET_ROCKETS(state, rockets: RocketEntity[]) {
      state.rockets = rockets;
    },
    CLEAR_ROCKETS(state) {
      state.rockets = [];
    },
    RESET(state) {
      Object.assign(state, new RocketListState());
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
    loadRockets({ commit }, rockets: RocketEntity[]) {
      commit('SET_ROCKETS', rockets);
    },
    clearRockets({ commit }) {
      commit('CLEAR_ROCKETS');
    },
    reset({ commit }) {
      commit('RESET');
    },
  },
  getters: {
    rockets: state => state.rockets,
    isLoading: state => state.isLoading,
    isError: state => state.isError,
    errorMessage: state => state.errorMessage,
  },
};
