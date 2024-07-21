import { ref, computed } from "vue";
import { Site, Client, User } from "@/types";

interface State {
  sites: Site[] | null;
  totalCount: number | null;
  user: User | null;
  clients: Client[] | null;
}

const state = ref<State>({
  sites: [],
  totalCount: null,
  user: null,
  clients: [],
});

//Basic store for state management
export function useStore() {
  return {
    //caching mechanism for sites data so there's no unnecessary api calls in the detail view
    sites: computed(() => state.value.sites),
    totalCount: computed(() => state.value.totalCount),
    siteById: computed(() =>
      state.value.sites?.reduce(
        (acc, item) => ({ ...acc, [item.id]: item }),
        {} as Record<string, Site>
      )
    ),
    setSites: (sites: Site[], totalCount: number) => {
      state.value = {
        ...state.value,
        sites,
        totalCount
      };
    },

    //Using this for filters
    clients: computed(() => state.value.clients),
    clientOptions: computed(() => state.value.clients?.map(item => ({ title: item.givenName, value: item.id}))),
    tagOptions: computed(() => state.value.clients?.flatMap(item => item.tags)),
    setClients: (clients: Client[]) => {
      state.value = {
        ...state.value,
        clients
      };
    },

    //Using this to set the user avatar
    user: computed(() => state.value.user),
    setUser: (user: User) => {
      state.value = {
        ...state.value,
        user
      };
    },
  };
}
