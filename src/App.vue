<script lang="ts" setup>
import { onBeforeMount, ref, computed, watch } from "vue";

const drawer = ref(false);
const menu = ref([
  {
    title: "Scheduling",
    value: "scheduling",
  },
]);
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="surface-variant">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Scheduling</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list>
        <v-list-item :items="menu" title="Menu"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item title="Drawer right"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>
