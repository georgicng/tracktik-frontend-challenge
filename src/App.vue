<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { User,  } from "@/types";

const { user, setUser } = useStore();
const { basicFetch } = useFetch<User>();

const drawer = ref(false);
const menu = ref([
  {
    title: "Scheduling",
    value: "scheduling",
  },
]);

onBeforeMount(() => {
  basicFetch('https://tracktik-challenge.staffr.com/me').then((res) => {
    setUser(res);
  });
})
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
      <v-avatar v-if="user" :image="user.avatar"></v-avatar>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list>
        <v-list-item :items="menu" title="Menu"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>
