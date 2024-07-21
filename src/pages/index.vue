<script lang="ts" setup>
import { onBeforeMount, ref, computed, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { getAddress, getContact, getAvatar } from "@/utils";
import { Site } from "@/types";

const query = ref("");
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const length = computed(() => total.value / perPage.value);
const params = computed(() => {
  return {
    q: query.value,
    _page: page.value,
    _limit: perPage.value,
  } as const;
});

const { sites, setSites } = useStore();
const sitesError = ref(false);
const loading = ref(false);
const fetch = async () => {
  const { data, hasError, isLoading, meta } = await useFetch<Site[]>(
    "https://tracktik-challenge.staffr.com/sites",
    params.value
  );
  setSites(data.value);
  loading.value = isLoading.value;
  sitesError.value = hasError.value;
  total.value = meta.value.count;
};

const search = () => {
  page.value = 1;
  fetch()
};

const clearSearch = () => {
  query.value = "";
  page.value = 1;
  fetch();
};


onBeforeMount(() => {
  if (sites.value?.length  >  0) {
    return;
  }
  fetch();
});
watch(page, fetch);
</script>

<template>
  <div>
    <p v-if="loading">loading....</p>
    <p v-else-if="sitesError">Unable to retrieve users</p>
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
