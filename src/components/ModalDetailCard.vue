<template>
  <v-container>
    <!-- Modal Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="pa-4" max-width="500px">
        <!-- Event Header Image -->
        <v-img src="https://picsum.photos/60?random=1" height="220" cover>
          <div class="d-flex flex-column justify-end h-100 p-4 white--text" style="padding: 5px;">
            <h3 class="text-h5 font-weight-bold">
              Boston Celtics at Miami Heat
            </h3>
            <div class="text-body-2">Sec 106 • Row 1 | 5 Tickets</div>
            <div class="text-body-2">Apr 30, 2025 | 7:30 PM ET</div>
          </div>
        </v-img>
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
