import spaceXClient from "@/service/api.js";

const getListRockets =  async function() {
  const response = await spaceXClient.get("/v4/rockets");
  return response.data;
}

export {getListRockets};
