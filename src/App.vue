<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { User } from "@/types";
import { baseURL } from "@/utils";

//Idea was to use avater from /me endpoint but I'm getting a forbidden access
// so i commented out the tag hence why it's unused, leaving it to show that  I did consider it
const { user, setUser } = useStore();
const { basicFetch } = useFetch<User>();

const drawer = ref(false);
const menu = ref([
  {
    title: "Scheduling",
    value: "scheduling",
  },
]);

//Still fetching the user profile anyways
//Can do it without OnBeforeMount hook, usng the hook for demo purposes.
onBeforeMount(() => {
  basicFetch(`${baseURL}/me`).then((res) => {
    setUser(res);
  });
});
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar color="surface-variant">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </template>
      <v-spacer></v-spacer>

      <v-app-bar-title class="flex text-center">Scheduling</v-app-bar-title>

      <v-spacer></v-spacer>
      <template v-slot:append>
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-avatar color="white">
        <span class="text-h5">D</span>
      </v-avatar>
      <!--v-avatar v-if="user" :image="user.avatar"></v-avatar-->
    </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item :items="menu" title="Menu"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>
