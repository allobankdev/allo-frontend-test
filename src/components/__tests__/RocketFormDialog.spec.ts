/* eslint-disable vue/one-component-per-file */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";
import RocketFormDialog from "../RocketFormDialog.vue";

const formValidation = {
  validate: vi.fn(),
  resetValidation: vi.fn(),
};

const VDialogStub = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    function openDialog() {
      emit("update:modelValue", true);
    }

    return { openDialog };
  },
  template: `
    <div>
      <slot
        name="activator"
        :props="{ onClick: openDialog }"
      />
      <div v-if="modelValue" data-testid="dialog-content">
        <slot />
      </div>
    </div>
  `,
});

const VBtnStub = defineComponent({
  template: `
    <button v-bind="$attrs">
      <slot />
    </button>
  `,
});

const VFormStub = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, expose, slots }) {
    expose({
      validate: formValidation.validate,
      resetValidation: formValidation.resetValidation,
    });

    return () =>
      h(
        "form",
        {
          ...attrs,
          onSubmit: (event: Event) => event.preventDefault(),
        },
        slots.default?.(),
      );
  },
});

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
    type: {
      type: String,
      default: "text",
    },
    rules: {
      type: Array as PropType<Array<(value: string) => boolean | string>>,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  template: `
    <input
      :aria-label="label"
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  `,
});

const VTextareaStub = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  template: `
    <textarea
      :aria-label="label"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  `,
});

const VCardStub = defineComponent({
  template: "<div><slot /></div>",
});

const VSpacerStub = defineComponent({
  template: "<span />",
});

function mountRocketFormDialog() {
  return mount(RocketFormDialog, {
    global: {
      stubs: {
        VDialog: VDialogStub,
        VBtn: VBtnStub,
        VForm: VFormStub,
        VTextField: VTextFieldStub,
        VTextarea: VTextareaStub,
        VCard: VCardStub,
        VCardTitle: VCardStub,
        VCardText: VCardStub,
        VCardActions: VCardStub,
        VSpacer: VSpacerStub,
      },
    },
  });
}

async function openDialog(wrapper: ReturnType<typeof mountRocketFormDialog>) {
  const activator = wrapper
    .findAll("button")
    .find((button) => button.text().includes("Add Rocket"));

  if (!activator) {
    throw new Error("Add Rocket button was not found");
  }

  await activator.trigger("click");
}

async function clickButton(
  wrapper: ReturnType<typeof mountRocketFormDialog>,
  buttonText: string,
) {
  const button = wrapper
    .findAll("button")
    .find((item) => item.text().includes(buttonText));

  if (!button) {
    throw new Error(`${buttonText} button was not found`);
  }

  await button.trigger("click");
}

describe("RocketFormDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    formValidation.validate.mockResolvedValue({
      valid: true,
    });
  });

  it("renders the Add Rocket button", () => {
    const wrapper = mountRocketFormDialog();

    expect(
      wrapper
        .findAll("button")
        .some((button) => button.text().includes("Add Rocket")),
    ).toBe(true);
  });

  it("opens the dialog when Add Rocket is clicked", async () => {
    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    expect(wrapper.find('[data-testid="dialog-content"]').exists()).toBe(true);
  });

  it("does not emit add when form validation fails", async () => {
    formValidation.validate.mockResolvedValue({
      valid: false,
    });

    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    await wrapper.find('[aria-label="Rocket name"]').setValue("Falcon 9");

    await clickButton(wrapper, "Save Rocket");

    expect(formValidation.validate).toHaveBeenCalledOnce();
    expect(wrapper.emitted("add")).toBeUndefined();
  });

  it("requires a non-empty rocket name", async () => {
    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    const nameField = wrapper.findComponent(VTextFieldStub);
    const rules = nameField.props("rules");
    const requiredRule = rules?.[0];

    if (typeof requiredRule !== "function") {
      throw new Error("Rocket name required rule was not found");
    }

    expect(requiredRule("")).toBe("Rocket name is required");
    expect(requiredRule("   ")).toBe("Rocket name is required");
    expect(requiredRule("Falcon 9")).toBe(true);
  });

  it("emits trimmed rocket data when the form is valid", async () => {
    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    await wrapper.find('[aria-label="Rocket name"]').setValue("  Falcon 9  ");

    await wrapper
      .find('[aria-label="Description"]')
      .setValue("  Reusable rocket  ");

    await wrapper
      .find('[aria-label="Image URL"]')
      .setValue("  https://example.com/falcon.jpg  ");

    await wrapper
      .find('[aria-label="Cost per launch"]')
      .setValue("  $67 million  ");

    await wrapper.find('[aria-label="Country"]').setValue("  US  ");

    await wrapper.find('[aria-label="First flight"]').setValue("2010-06-04");

    await clickButton(wrapper, "Save Rocket");

    expect(wrapper.emitted("add")).toEqual([
      [
        {
          name: "Falcon 9",
          description: "Reusable rocket",
          imageUrl: "https://example.com/falcon.jpg",
          launchCost: "$67 million",
          country: "US",
          firstFlight: "2010-06-04",
          isCustom: true,
        },
      ],
    ]);
  });

  it("converts empty optional fields to null", async () => {
    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    await wrapper.find('[aria-label="Rocket name"]').setValue("Falcon 9");

    await clickButton(wrapper, "Save Rocket");

    const emittedEvents = wrapper.emitted("add");

    expect(emittedEvents).toBeDefined();
    expect(emittedEvents![0][0]).toEqual({
      name: "Falcon 9",
      description: "",
      imageUrl: null,
      launchCost: null,
      country: null,
      firstFlight: null,
      isCustom: true,
    });
  });

  it("closes and resets the form after successful submission", async () => {
    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    await wrapper.find('[aria-label="Rocket name"]').setValue("Falcon 9");

    await clickButton(wrapper, "Save Rocket");

    expect(wrapper.find('[data-testid="dialog-content"]').exists()).toBe(false);

    expect(formValidation.resetValidation).toHaveBeenCalled();

    await openDialog(wrapper);

    expect(
      (wrapper.find('[aria-label="Rocket name"]').element as HTMLInputElement)
        .value,
    ).toBe("");
  });

  it("closes and resets the form when Cancel is clicked", async () => {
    const wrapper = mountRocketFormDialog();

    await openDialog(wrapper);

    await wrapper.find('[aria-label="Rocket name"]').setValue("Starship");

    await clickButton(wrapper, "Cancel");

    expect(wrapper.find('[data-testid="dialog-content"]').exists()).toBe(false);

    expect(wrapper.emitted("add")).toBeUndefined();
    expect(formValidation.resetValidation).toHaveBeenCalled();

    await openDialog(wrapper);

    expect(
      (wrapper.find('[aria-label="Rocket name"]').element as HTMLInputElement)
        .value,
    ).toBe("");
  });
});
