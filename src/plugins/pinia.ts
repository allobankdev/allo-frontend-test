import { createPinia } from "pinia";
import piniaPluginPersistendState from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistendState);

export default pinia;
