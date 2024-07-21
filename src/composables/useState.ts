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

export function useStore() {
  return {
    sites: computed(() => state.value.sites),
    totalCount: computed(() => state.value.totalCount),
    siteById: computed(() =>
      state.value.sites?.reduce(
        (acc, item) => ({ ...acc, [item.id]: item }),
        {}
      )
    ),
    setSites: (sites: Site[], totalCount: number) => {
      state.value = {
        ...state.value,
        sites,
        totalCount
      };
    },

    clients: computed(() => state.value.clients),
    clientOptions: computed(() => state.value.clients?.map(item => ({ title: item.givenName, value: item.id}))),
    tagOptions: computed(() => state.value.clients?.flatMap(item => item.tags)),
    setClients: (clients: Client[]) => {
      state.value = {
        ...state.value,
        clients
      };
    },

    user: computed(() => state.value.user),
    setUser: (user: User) => {
      state.value = {
        ...state.value,
        user
      };
    },
  };
}
