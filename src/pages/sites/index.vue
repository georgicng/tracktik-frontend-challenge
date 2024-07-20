<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { useRouter, useRoute } from "vue-router";
import { getAddress, getContact, getAvatar } from "@/utils";
import { Site } from "@/types";


const router = useRouter();
const route = useRoute();
const getParam = (key: string, defaultValue = "") => {
  if (route.query[key]) {
    return route.query[key] as string;
  }
  return defaultValue;
}

const query = ref(getParam('q'));
const page = ref(parseInt(getParam('_page', '1')));
const perPage = ref(parseInt(getParam('_limit', '10')));
const length = computed(() => totalCount.value / perPage.value);
const params = computed(() => {
  return {
    q: query.value,
    _page: String(page.value),
    _limit: String(perPage.value),
  }
});

const { sites, totalCount, setSites } = useStore();
const { data, hasError, isLoading, meta, fetchData } = useFetch<Site[]>();
const fetch = async () => {
  await fetchData("https://tracktik-challenge.staffr.com/sites", params.value);
  setSites(data.value, meta.value.count);
};
watch(page, () => {
  router.push({ query: params.value })
});

watch(
    () => route.query,
    () => {
      fetch();
    },
  )


const search = () => {
  page.value = 1;
  fetch();
};

const clearSearch = () => {
  query.value = "";
  page.value = 1;
  fetch();
};

if (!sites.value?.length) {
  fetch();
}
</script>

<template>
  <div>
    <p v-if="isLoading">loading....</p>
    <p v-else-if="hasError">Unable to retrieve users</p>
    <div v-else-if="sites">
      <v-text-field
        label="Search site"
        placeholder="Type to search a site"
        append-inner-icon="mdi-magnify"
        outlined
        dense
        hide-details="auto"
        class="my-2 mx-2"
        clearable
        @click:clear="clearSearch"
        @click:append-inner="search"
        v-model="query"
      >
      </v-text-field>
      <v-list three-line>
        <v-list-item
          v-for="site in sites"
          :key="site.id"
          :title="site.title"
          append-icon="mdi-chevron-right"
          :prepend-avatar="getAvatar(site)"
          :to="`/sites/${site.id}`"
        >
          <template #subtitle>
            <div>
              <div class="mr-2">{{ getAddress(site) }}</div>
              <div>{{ getContact(site) }}</div>
            </div>
          </template>
        </v-list-item>
      </v-list>
      <div>
        <v-pagination
          v-model="page"
          :length="length"
          @first="page = 1"
          @last="page = length"
          @prev="page--"
          @next="page++"
          @update:modelValue="page = $event"
        />
      </div>
    </div>
  </div>
</template>
