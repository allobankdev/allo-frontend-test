import spaceXClient from "@/service/api.js";

const getListRockets =  async function() {
  try {
    const response = await spaceXClient.get("/v4/rockets");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export {getListRockets};
