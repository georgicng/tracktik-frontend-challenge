<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useStore } from "@/composables/useState";
import { useRouter, useRoute } from "vue-router";
import {
  getAddress,
  getContact,
  getAvatar,
  countryList,
  baseURL,
} from "@/utils";
import { Site } from "@/types";

//Routing specific variables
const router = useRouter();
const route = useRoute();
const getParam = (key: string, defaultValue: string | null) => {
  if (route.query[key]) {
    if (key === "_order") {
      return route.query[key] === "asc" ? Direction.ASC : Direction.DESC;
    }
    return route.query[key] as string;
  }
  return defaultValue;
};

//Filter related variables
const client = ref(getParam("clientId", null));
const tag = ref(getParam("tag", null));
const country = ref(getParam("address.country", null));

//Sorting related variables
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

//Search model
const query = ref(getParam("q", ""));

//Pagination related models
const getPage = () => {
  const val = getParam("_page", "1")
  if (val) {
    return parseInt(val);
  }
  return 1
}
const page = ref(getPage());
const getPerPage = () => {
  const val = getParam("_limit", "10")
  if (val) {
    return parseInt(val);
  }
  return 10
}
const perPage = ref(getPerPage());
const length = computed(() => {
  if (!totalCount.value) {
    return 0;
  }
  return Math.floor(totalCount.value / perPage.value);
});

//Build query params for route update, ensure void arguments are not included in the query
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

//Getting sites from store to for caching sake
const { sites, totalCount, setSites, clientOptions, tagOptions, setClients } =
  useStore();

//Fetch hook for reuse
const { data, hasError, isLoading, meta, fetchData, basicFetch } =
  useFetch<Site[]>();

//Function to fetch sites data
const fetch = async () => {
  await fetchData(`${baseURL}/sites`, params.value);
  if (meta.value && data.value) {
    setSites(data.value, meta.value.count);
  }
};

//Pagination Actions
const gotoPage = (input: number) => {
  page.value = input;
};

//Trigger reload on pagination, need to do so cause pagination component can update the model directly and not trigger a fetch
watch(page, () => {
  router.push({ query: params.value });
});

//Trigger reload on sorting
watch(
  () => [sortBy.value, sortOrder.value],
  () => {
    page.value = 1;
    router.push({ query: params.value });
  }
);

//Search actions
const search = () => {
  page.value = 1;
  router.push({ query: params.value });
};

const clearSearch = () => {
  query.value = "";
  page.value = 1;
  router.push({ query: params.value });
};

//Filter Options
const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const applyFilters = () => {
  page.value = 1;
  toggleDrawer();
  router.push({ query: params.value });
};
const clearFilters = () => {
  country.value = null;
  client.value = null;
  tag.value = null;
  page.value = 1;
  toggleDrawer();
  router.push({ query: params.value });
};

//Clear and reload for empyty search
const reload = () => {
  country.value = null;
  client.value = null;
  tag.value = null;
  page.value = 1;
    query.value = null;
    sortBy.value = null;
    sortOrder.value = null;
  router.push({ query: params.value });
};

//Fetch Data on route update
watch(
  () => route.query,
  () => {
    fetch();
  }
);

//First load
if (!sites.value?.length) {
  //Fetching clients for the filter sidebar
  Promise.all([fetch(), basicFetch(`${baseURL}/clients`)]).then((values) => {
    setClients(values[1]);
  });
}
</script>

<template>
  <v-toolbar color="primary" flat>
    <v-toolbar-title class="flex text-center"> Sites </v-toolbar-title>
  </v-toolbar>
  <v-skeleton-loader
    :loading="isLoading"
    type="actions, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line, list-item-avatar-three-line, actions"
  >
    <v-empty-state
      v-if="hasError"
      headline="Whoops, 404"
      title="Page not found"
      text="The page you were looking for does not exist"
      image="https://placehold.co/600x400"
    ></v-empty-state>
    <template v-else-if="sites && sites.length">
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
            <div class="d-flex justify-space-between my-2">
              <v-btn density="compact" class="p-2" @click="applyFilters()"
                >Apply</v-btn
              >
              <v-btn density="compact" class="p-2" @click="clearFilters()"
                >Clear</v-btn
              >
            </div></v-list-item
          >
        </template>
      </v-navigation-drawer>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="6" class="m-1">
            <v-text-field
              label="Search site"
              placeholder="Type to search a site"
              append-inner-icon="mdi-magnify"
              outlined
              dense
              hide-details="auto"
              clearable
              @click:clear="clearSearch"
              @click:append-inner="search"
              v-model="query"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6" class="m-1">
            <v-row>
              <v-col cols="6" sm="8">
                <v-select
                  label="Sort by"
                  v-model="sortBy"
                  :items="sortOptions"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="6" sm="4">
                <v-btn-toggle v-model="sortOrder" color="primary" mandatory>
                  <v-btn
                    icon="mdi-sort-ascending"
                    :value="Direction.ASC"
                  ></v-btn>
                  <v-btn
                    icon="mdi-sort-descending"
                    :value="Direction.DESC"
                  ></v-btn>
                </v-btn-toggle>
                <v-fab
                  :active="!drawer"
                  icon="mdi-filter-variant"
                  location="right"
                  sticky
                  offset
                  @click="toggleDrawer"
                ></v-fab>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row style="margin-top:-40px">
          <v-col>
            <v-list three-line>
              <template v-for="site in sites" :key="site.id">
                <v-list-item
                  :title="site.title"
                  append-icon="mdi-chevron-right"
                  :prepend-avatar="getAvatar(site)"
                  :to="`/sites/${site.id}`"
                  lines="three"
                >
                  <template #subtitle>
                    <span>{{ getAddress(site) }}</span
                    ><br />
                    <span class="flex">{{ getContact(site) }}</span>
                  </template>
                </v-list-item>
                <v-divider inset></v-divider>
              </template>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <v-pagination
                v-model="page"
                :length="length"
                @first="gotoPage($event)"
                @last="gotoPage($event)"
                @prev="gotoPage($event)"
                @next="gotoPage($event)"
                @update:modelValue="page = $event"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <v-empty-state
      v-else
      headline="Whoops, Empty"
      title="No item found"
      text="Seems we are out of data"
      image="https://placehold.co/600x400"
    >
    <template v-slot:actions>
      <v-btn
        class="text-none"
        color="white"
        elevation="1"
        rounded="lg"
        size="small"
        text="Reload"
        width="96"
        @click="reload"
      ></v-btn>
    </template></v-empty-state>
  </v-skeleton-loader>
</template>
