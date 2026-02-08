import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RocketCard from "@/components/RocketCard.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

describe("RocketCard.vue", () => {
  const mockRocket = {
    id: "1",
    name: "Starship",
    description: "The big one",
    flickr_images: ["http://example.com/img.jpg"],
    cost_per_launch: 1000,
    country: "USA",
    first_flight: "2020-01-01",
  };

  it("renders rocket name correctly", () => {
    const wrapper = mount(RocketCard, {
      props: { rocket: mockRocket },
      global: {
        plugins: [vuetify],
        stubs: ["router-link"],
      },
    });

    expect(wrapper.text()).toContain("Starship");
    expect(wrapper.text()).toContain("The big one");
  });
});
