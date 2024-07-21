<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { useRouter, useRoute } from "vue-router";
import { getAddress, getContact, getAvatar, countryList } from "@/utils";
import { Site } from "@/types";

const router = useRouter();
const route = useRoute();
const getParam = (key: string, defaultValue: string | null) => {
  if (route.query[key]) {
    if (key === "_order") {
      return Direction[route.query[key] as string];
    }
    return route.query[key] as string;
  }
  return defaultValue;
};

const drawer = ref(false);
const client = ref(getParam("client", null));
const tag = ref(getParam("tag", null));
const country = ref(getParam("address.country", null));
const sortBy = ref(getParam("_sort", null));
const sortOptions = [
  {
    title: "Created Date",
    value: "createdAt",
  },
  {
    title: "Update Date",
    value: "updatedAt",
  },
  {
    title: "Title",
    value: "title",
  },
  {
    title: "Client",
    value: "clientId",
  },
];

enum Direction {
  ASC = "asc",
  DESC = "desc",
}
const sortOrder = ref(getParam("_order", Direction.ASC));

const query = ref(getParam("q", ""));
const page = ref(parseInt(getParam("_page", "1")));
const perPage = ref(parseInt(getParam("_limit", "10")));
const length = computed(() => totalCount.value / perPage.value);
const params = computed(() => {
  return {
    _page: String(page.value),
    _limit: String(perPage.value),
    ...(query.value ? { q: query.value } : {}),
    ...(sortBy.value ? { _sort: sortBy.value } : {}),
    ...(sortOrder.value ? { _order: sortOrder.value } : {}),
    ...(tag.value ? { tag: tag.value } : {}),
    ...(country.value ? { "address.country": country.value } : {}),
    ...(client.value ? { clientId: client.value } : {}),
  };
});

const { sites, totalCount, setSites, clientOptions, tagOptions, setClients } =
  useStore();
const { data, hasError, isLoading, meta, fetchData, basicFetch } =
  useFetch<Site[]>();
const fetch = async () => {
  await fetchData("https://tracktik-challenge.staffr.com/sites", params.value);
  setSites(data.value, meta.value.count);
};
watch(page, () => {
  router.push({ query: params.value });
});

watch(
  () => [sortBy.value, sortOrder.value],
  () => {
    page.value = 1;
    router.push({ query: params.value });
  }
);

watch(
  () => route.query,
  () => {
    fetch();
  }
);

const search = () => {
  page.value = 1;
  fetch();
};

const clearSearch = () => {
  query.value = "";
  page.value = 1;
  fetch();
};

const applyFilters = () => {
  page.value = 1;
  fetch();
};

const clearFilters = () => {
  country.value = null;
  client.value = null;
  tag.value = null;
  page.value = 1;
  fetch();
};

if (!sites.value?.length) {
  Promise.all([
    fetch(),
    basicFetch("https://tracktik-challenge.staffr.com/clients"),
  ]).then((values) => {
    setClients(values[1]);
  });
}
</script>

<template>
  <div>
    <p v-if="isLoading">loading....</p>
    <p v-else-if="hasError">Unable to retrieve users</p>
    <div v-else-if="sites">
      <v-navigation-drawer v-model="drawer" location="right" temporary>
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            title="Filter"
            subtitle="Narrow your search by specific fields"
          ></v-list-item>
          <v-divider></v-divider>
        </template>

        <v-list density="compact" nav>
          <v-list-item>
            <v-autocomplete
               v-model="client"
              :items="clientOptions"
              color="blue-grey-lighten-2"
              label="Client"
              chips
              closable-chips
            >
            </v-autocomplete
          ></v-list-item>
          <v-list-item>
            <v-autocomplete
              v-model="tag"
              :items="tagOptions"
              color="blue-grey-lighten-2"
              label="Tag"
              chips
              closable-chips
            >
            </v-autocomplete
          ></v-list-item>
          <v-list-item>
            <v-autocomplete
              v-model="country"
              :items="countryList"
              color="blue-grey-lighten-2"
              label="Country"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <v-divider></v-divider>
          <v-list-item>
            <v-btn density="compact" @click="applyFilters()">Apply</v-btn>
            <v-btn density="compact" @click="clearFilters()"
              >Clear</v-btn
            ></v-list-item
          >
        </template>
      </v-navigation-drawer>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="6">
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
          </v-col>
          <v-col cols="4">
            <v-select
              label="Sort by"
              v-model="sortBy"
              :items="sortOptions"
            ></v-select>
            <v-btn
              density="compact"
              :icon="
                sortOrder === Direction.ASC
                  ? 'mdi-sort-ascending'
                  : 'mdi-sort-descending'
              "
              @click="
                sortOrder =
                  sortOrder === Direction.ASC ? Direction.DESC : Direction.ASC
              "
            ></v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn
              density="compact"
              icon="mdi-plus"
              @click="drawer = !drawer"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>
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
