import { ref, computed } from "vue";
import { Site } from "@/types";

interface State {
  sites: Site[] | null;
  totalCount: number | null;
}

const state = ref<State>({
  sites: [],
  totalCount: null,
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
        sites,
        totalCount
      };
    },
  };
}
