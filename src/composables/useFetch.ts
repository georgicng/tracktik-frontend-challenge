import { reactive, toRefs } from "vue";

interface State<T> {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  data: T | null;
  meta: { link: string; count: number } | null;
}

export const useFetch = <T>() => {
  const state = reactive<State<T>>({
    isLoading: false,
    hasError: false,
    errorMessage: "",
    data: null,
    meta: null,
  });

  const getQuery = (params: Record<string, string> | undefined) => {
    return params
    ? Object.keys(params)
        .map(
          (k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
        )
        .join("&")
    : "";
  }

  const fetchData = async (
    url: string,
    params?: Record<string, string>,
    options?: Record<string, unknown>
  ) => {
    state.isLoading = true;

    try {
      const response = await fetch(`${url}?${getQuery(params)}`, options);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      state.data = await response.json();
      state.meta = {
        count: parseInt(response.headers.get("X-Total-Count") || "0"),
        link: response.headers.get("Link") || "",
      };
    } catch (error: unknown) {
      const typedError = error as Error;
      state.hasError = true;
      state.errorMessage = typedError.message;
    } finally {
      state.isLoading = false;
    }
  };

  const basicFetch = async (
    url: string,
    params?: Record<string, string>,
    options?: Record<string, unknown>
  ) => {
      const response = await fetch(`${url}?${getQuery(params)}`, options);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
  };

  return {
    ...toRefs(state),
    fetchData,
    basicFetch
  };
};
