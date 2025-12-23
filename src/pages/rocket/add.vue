<template>
  <Layout>
    <v-container>
      <v-breadcrumbs :items="items" class="px-0">
        <template v-slot:prepend>
          <v-icon icon="$vuetify" size="small"></v-icon>
        </template>
      </v-breadcrumbs>
      <v-card class="pa-6" elevation="3">
        <v-form ref="formRef" @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Rocket Name"
                :rules="[rules.required, rules.min3]"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.cost_per_launch"
                label="Cost Per Launch"
                type="number"
                prefix="$"
                :rules="[rules.required, rules.positiveNumber]"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                auto-grow
                rows="3"
                :rules="[rules.required, rules.min3]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.country"
                label="Country"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.first_flight"
                label="First Flight"
                type="date"
                :rules="[rules.date]"
              />
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="form.flickr_images"
                label="Flickr Images (URLs)"
                placeholder="Press Enter after typing the URL"
                multiple
                chips
                clearable
                hide-selected
                :rules="[rules.required, rules.url]"
              />
            </v-col>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn variant="outlined" class="mr-2" @click="reset">
                Reset
              </v-btn>
              <v-btn color="blue-accent-2" type="submit"> Save </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
  </Layout>
</template>

<script>
import Layout from "@/components/rocket/Layout.vue";
import Skeleton from "@/components/rocket/Skeleton.vue";
import { useRocketStore } from "@/stores/rocket";
import { reactive, ref } from "vue";
import router from "@/router";

export default {
  components: { Layout, Skeleton },
  setup() {
    const rocketStore = useRocketStore();
    const items = [
      {
        title: "Rocket",
        disabled: false,
        to: "/rocket",
      },
      {
        title: "Add",
        disabled: false,
        to: `/rocket/add`,
      },
    ];
    const form = reactive({
      id: "",
      name: "",
      description: "",
      flickr_images: [],
      cost_per_launch: 0,
      country: "",
      first_flight: "",
    });
    const formRef = ref();

    const rules = {
      required: (v) => !!v || "This field is required",
      min3: (v) => (v && v.length >= 3) || "Minimum 3 characters",
      positiveNumber: (v) => v > 0 || "Must be greater than 0",
      date: (v) => !!v || "Date is required",
      url: (v) => !v || v.length > 0 || "URL is required",
    };

    const submit = async () => {
      const { valid } = await formRef.value.validate();
      if (!valid) return;

      form.id = new Date().getTime().toString();
      rocketStore.addRocket(form);
      router.replace("/rocket");
      rocketStore.showAlert();
    };

    const reset = () => {
      formRef.value.reset();
      formRef.value.resetValidation();
    };

    return {
      items,
      submit,
      form,
      reset,
      rules,
      formRef,
    };
  },
};
</script>

<style></style>
