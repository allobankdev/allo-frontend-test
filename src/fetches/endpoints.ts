const BASE_URL = "https://lldev.thespacedevs.com/2.2.0/config";

export const endpoints = {
  rocketList: () =>
    `${BASE_URL}/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`,
  rocketDetail: (id: string) => `${BASE_URL}/launcher/${id}/`,
};
