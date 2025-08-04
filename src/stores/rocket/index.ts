import { defineStore } from "pinia";
import useRocketState from "./state";
import useRocketGetters from "./getters";
import useRocketActions from "./actions";

export const useRocketsStore = defineStore("rockets", () => {
  const state = useRocketState();
  const getters = useRocketGetters(state);
  const actions = useRocketActions(state);
  actions.loadLocalRockets();

  return {
    ...state,
    ...getters,
    ...actions,
  };
});
