import { createStore } from "vuex";
import { rocketListModule } from "../pages/rockets/stores/rocket-list";
import { rocketDetailModule } from "../pages/rockets/stores/rocket-detail";

export const store = createStore({
  modules: {
    rocketList: rocketListModule,
    rocketDetail: rocketDetailModule,
  },
});

export type RootState = {
  rocketList: typeof rocketListModule.state;
  rocketDetail: typeof rocketDetailModule.state;
};
