import type { RocketList } from "@/types";

// note : for base url u can use .env file and import it here

export const getRockets = async () => {
  try {
    const response: Response = await fetch(
      "https://api.spacexdata.com/v4/rockets",
    );

    const data: RocketList[] = await response.json();

    // console.log(data, "ini rockets");

    return data;
  } catch (error) {
    throw error;
  }
};

export const getRocketDetail = async (id: string) => {
  try {
    const response: Response = await fetch(
      `https://api.spacexdata.com/v4/rockets/${id}`,
    );

    const data: RocketList = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
