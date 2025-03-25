import { ref, onBeforeMount, onBeforeUpdate, onMounted, reactive } from "vue";
import { defineStore } from 'pinia';
import { useRouter } from "vue-router";
import rocketRemoteSource from "../data/remote/rocketRemoteSource";

export const useRocketStore = defineStore("rocketStore", () => {
  // list
  const searchQueryChange = ref("");
  const rockets = ref([]);
  const isLoadingList = ref(true);
  const statusFilterSelected = ref("Semua Status");

  // detail
  const rocketItem = ref(null);
  const window = ref(0);
  const isLoadingDetail = ref(true);

  // upsert
  const image = ref(null);
  const name = ref("");
  const status = ref(true);
  const description = ref("");
  const costPerLaunch = ref("");
  const country = ref("");
  const firstFlight = ref("");

  const errorRocket = ref(null);

  const router = useRouter();

  onMounted(async () => {
    await getAllRockets();
  });

  // get rockets data
  async function getAllRockets() {
    isLoadingList.value = true;
    errorRocket.value = null;

    try {
      const result = await rocketRemoteSource.getAllRockets();
      rockets.value = result;

    } catch (error) {
      errorRocket.value = "Error fetching rockets. Please try again.";
    } finally {
      isLoadingList.value = false;
    }
  }
  
  // get rocket data by id
  async function getRocketById(id) {
    isLoadingDetail.value = true;
    errorRocket.value = null;

    try {
      const result = await rocketRemoteSource.getRocketById(id);
      rocketItem.value = result;

    } catch (error) {
      errorRocket.value = "Error fetching rockets. Please try again.";
    } finally {
      isLoadingDetail.value = false;
    }
  }

  // add rocket
  async function addRocket() {
    rockets.value.push({
      flickr_images: [image.value],
      name: name.value,
      status: status.value,
      description: description.value,
      cost_per_launch: costPerLaunch.value,
      country: country.value,
      first_flight: firstFlight.value,
    });

    router.push('/');

    // reset input form
    resetFormAdd();
  }

  // reset form add page
  function resetFormAdd() {
    image.value = null;
    name.value = "";
    status.value = false;
    description.value = "";
    costPerLaunch.value = "";
    country.value = "";
    firstFlight.value = "";
  }

  // navigate to detail page
  function navigateToDetail(id) {
    router.push(`/${id}`);
  }

  // navigate to add page
  async function navigateToAdd() {
    router.push('/add');
  }

  return {
    errorRocket,
    // list
    searchQueryChange,
    rockets,
    isLoadingList,
    statusFilterSelected,
    // detail
    rocketItem,
    window,
    isLoadingDetail,
    // upsert
    image,
    name,
    status,
    description,
    costPerLaunch,
    country,
    firstFlight,
    // function
    getAllRockets,
    getRocketById,
    addRocket,
    resetFormAdd,
    navigateToDetail,
    navigateToAdd,
  };
});
