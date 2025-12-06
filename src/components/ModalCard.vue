<template>
  <v-container>
    <!-- Modal Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4" max-width="500px">
        <!-- Header Section with Icons -->
        <div>
          <v-img
            :width="200"
            aspect-ratio="16/9"
            cover
            src="../assets/spacex-logo-black.png"
          />
        </div>

        <!-- Form Section -->
        <v-form v-model="isValid">
          <v-text-field
            label="Title"
            v-model="title"
            :rules="[rules.required]"
            placeholder=""
          />

          <v-text-field
            label="Description"
            v-model="description"
            :rules="[rules.required]"
            placeholder=""
          />

          <v-text-field
            label="Image URL"
            v-model="imageUrl"
            :rules="[rules.required]"
            placeholder=""
          />
        </v-form>

        <!-- Footer Section -->
        <v-divider class="my-3"></v-divider>

        <!-- Actions -->
        <v-row>
          <v-col cols="6">
            <v-btn color="gray" block @click="cancelForm">Cancel</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="blue-grey-darken-3"
              block
              :disabled="!isValid || !publicDataAccepted"
              @click="nextStep"
            >
              Next
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      description: "",
      imageUrl: "",
      publicDataAccepted: false,
      isValid: false, // Used to validate the form
      rules: {
        required: (v) => !!v || "This field is required",
      },
    };
  },
  props: {
    modelValue: {
      // This is the default prop name for v-model
      type: Boolean,
      default: false,
    },
  },
  emits: ["open-modal"],
  computed: {
    dialog: {
      // Create a computed property to get and set the `modelValue`
      get() {
        return this.modelValue;
      },
      set(value) {
        // Emit an event to update the `modelValue`
        this.$emit("open-modal", value);
      },
    },
  },
  methods: {
    cancelForm() {
      this.title = "";
      this.description = "";
      this.imageUrl = "";
      this.publicDataAccepted = false;
      this.isValid = false;

      this.$emit("open-modal", false);
    },
    nextStep() {
      if (this.isValid && this.publicDataAccepted) {
        // You can perform the actual form submission here
        alert("Proceed to the next step!");
      } else {
        alert(
          "Please fill in all the fields and accept the public data terms."
        );
      }
    },
  },
};
</script>

<style scoped>
.pa-4 {
  padding: 16px;
}
.mr-4 {
  margin-right: 16px;
}
.headline {
  font-weight: 600;
}
.subtitle-1 {
  font-size: 14px;
}
.subtitle-2 {
  font-size: 12px;
}
.text-center {
  text-align: center;
}
</style>
