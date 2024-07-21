<script lang="ts" setup>
import { ref, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { Site } from "@/types";
import { useRoute } from "vue-router";
import { getAddress, getContact, getAvatar, baseURL } from "@/utils";

const route = useRoute();
const { siteById } = useStore();
const site = ref<Site | null>(null);
const { data, hasError, isLoading, fetchData } = useFetch<Site>();

// fetch the user information when params change
watch(
  () => route.params.id,
  async (newId) => {
    if (!siteById?.value[newId as string]) {
      await fetchData(`${baseURL}/sites/${newId}`);
      if (data.value) {
        site.value  = data.value;
      }
      return;
    }
    site.value = siteById.value[newId as string];
  },
  { immediate: true }
);
</script>

<template>
  <v-skeleton-loader v-if="isLoading" type="card-avatar, article, actions">
  </v-skeleton-loader>
  <v-empty-state
    v-else-if="hasError"
    headline="Whoops, 404"
    title="Page not found"
    text="The page you were looking for does not exist"
    image="https://placehold.co/600x400"
  ></v-empty-state>
  <v-card v-else-if="site" class="mx-auto">
    <v-toolbar color="primary" flat>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-list three-line bg-color="primary" variant="plain">
        <v-list-item
          :key="site.id"
          :title="site.title"
          :prepend-avatar="getAvatar(site, 2)"
          :to="`/sites/${site.id}`"
          lines="three"
        >
          <template #subtitle>
            <div>
              <div class="mr-2">{{ getAddress(site) }}</div>
              <div>{{ getContact(site) }}</div>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-toolbar>

    <v-img :src="getAvatar(site)" max-height="400" contain />

    <v-list two-line v-if="site.contacts">
      <v-list-item
        prepend-icon="mdi-account"
        :title="getContact(site)"
        :subtitle="site.contacts.main.jobTitle"
      />
      <v-list-item
        prepend-icon="mdi-phone"
        :title="site.contacts.main.phoneNumber"
      />
      <v-list-item prepend-icon="mdi-email" :title="site.contacts.main.email" />
      <v-list-item prepend-icon="mdi-map-marker" :title="getAddress(site)" />
    </v-list>
  </v-card>
</template>
