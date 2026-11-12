import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import RocketFilter from "../RocketFilter.vue";

const VTextFieldStub = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    clearable: Boolean,
  },
  emits: ["update:modelValue", "click:clear"],
  template: `
    <div>
      <input
        data-testid="search-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="clearable"
        data-testid="clear-button"
        @click="$emit('click:clear')"
      >
        Clear
      </button>
    </div>
  `,
});

function mountRocketFilter(initialValue = "") {
  return mount(RocketFilter, {
    props: {
      modelValue: initialValue,
    },
    global: {
      stubs: {
        VTextField: VTextFieldStub,
      },
    },
  });
}

describe("RocketFilter", () => {
  it("renders the search input", () => {
    const wrapper = mountRocketFilter();

    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true);
  });

  it("displays the initial search value", () => {
    const wrapper = mountRocketFilter("Falcon");

    expect(
      (wrapper.find('[data-testid="search-input"]').element as HTMLInputElement)
        .value,
    ).toBe("Falcon");
  });

  it("emits updated model value when user types", async () => {
    const wrapper = mountRocketFilter();

    await wrapper.find('[data-testid="search-input"]').setValue("Starship");

    expect(wrapper.emitted("update:modelValue")).toEqual([["Starship"]]);
  });

  it("clears the search value when clear is clicked", async () => {
    const wrapper = mountRocketFilter("Falcon");

    await wrapper.find('[data-testid="clear-button"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[""]]);
  });

  it("passes the clearable prop to the text field", () => {
    const wrapper = mountRocketFilter();

    expect(wrapper.findComponent(VTextFieldStub).props("clearable")).toBe(true);
  });
});
