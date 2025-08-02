<template>
  <v-card class="custom-search" flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            outlined
            clearable
            placeholder="Cari..."
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-btn color="primary" class="mr-2">
            <v-icon left>mdi-magnify</v-icon>
            Cari
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script></script>

<style scoped>
.custom-search {
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>
