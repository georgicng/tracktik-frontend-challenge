<script lang="ts" setup>
import { ref, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { Site } from "@/types";
import { useRoute } from "vue-router";
import { getAddress, getContact, getAvatar } from "@/utils";

const route = useRoute();
const { siteById } = useStore();
const site = ref<Site | null>([]);
const { data, hasError, isLoading, fetchData } = useFetch<Site[]>();

// fetch the user information when params change
watch(
  () => route.params.id,
  async (newId) => {
    if (siteById.value[newId]) {
      site.value = siteById.value[newId];
      return;
    }
    await fetchData(
      `https://tracktik-challenge.staffr.com/sites/${newId}`
    );
    site.value = data.value;
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <p v-if="isLoading">loading....</p>
    <p v-else-if="hasError">Unable to retrieve users</p>
    <v-card v-else-if="site" class="mx-auto">
      <v-list three-line class="blue" dark>
        <v-list-item
          :key="site.id"
          :title="site.title"
          prepend-icon="mdi-chevron-left"
          :to="`/sites/${site.id}`"
          @click="$router.go(-1)"
        >
          <template #subtitle>
            <div>
              <div class="mr-2">{{ getAddress(site) }}</div>
              <div>{{ getContact(site) }}</div>
            </div>
          </template>
        </v-list-item>
      </v-list>

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
        <v-list-item
          prepend-icon="mdi-email"
          :title="site.contacts.main.email"
        />
        <v-list-item prepend-icon="mdi-map-marker" :title="getAddress(site)" />
      </v-list>
    </v-card>
  </div>
</template>
