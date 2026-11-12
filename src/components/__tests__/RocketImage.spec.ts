import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import RocketImage from "../RocketImage.vue";

const VImgStub = defineComponent({
  emits: ["error"],
  template: `<div data-testid="image" @click="$emit('error')"><slot name="placeholder" /></div>`,
});

function mountRocketImage(src: string | null) {
  return mount(RocketImage, {
    props: { src, alt: "Falcon 9", height: 220 },
    global: {
      stubs: {
        VImg: VImgStub,
        VIcon: true,
        VProgressCircular: true,
      },
    },
  });
}

describe("RocketImage", () => {
  it("renders the image when a source is available", () => {
    const wrapper = mountRocketImage("https://example.com/falcon9.jpg");

    expect(wrapper.find('[data-testid="image"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain("Image unavailable");
  });

  it("renders the fallback when the source is missing", () => {
    const wrapper = mountRocketImage(null);

    expect(wrapper.find('[data-testid="image"]').exists()).toBe(false);
    expect(wrapper.text()).toContain("Image unavailable");
    expect(wrapper.find('[role="img"]').attributes("aria-label")).toBe(
      "Falcon 9 (image unavailable)",
    );
  });

  it("switches to the fallback when the image fails to load", async () => {
    const wrapper = mountRocketImage("https://example.com/broken.jpg");

    await wrapper.find('[data-testid="image"]').trigger("click");

    expect(wrapper.text()).toContain("Image unavailable");
  });

  it("tries the image again when the source changes", async () => {
    const wrapper = mountRocketImage("https://example.com/broken.jpg");

    await wrapper.find('[data-testid="image"]').trigger("click");
    await wrapper.setProps({ src: "https://example.com/working.jpg" });

    expect(wrapper.find('[data-testid="image"]').exists()).toBe(true);
  });
});
