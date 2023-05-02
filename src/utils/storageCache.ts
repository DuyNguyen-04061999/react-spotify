import store from "@/stores";
import { setCache } from "@/stores/cacheReducer";

type QueryKey = string;

export const localStorageCache = {
  set(name: string, data: unknown, expire: number) {
    const storeData = {
      data,
      expire,
    };

    localStorage && localStorage.setItem(name, JSON.stringify(storeData));
  },

  get(queryKey: QueryKey) {
    const storeData =
      localStorage && JSON.parse(localStorage.getItem(queryKey) || "{}");

    const now = Date.now();
    if (storeData) {
      if (storeData.expire && storeData.expire - now < 0) {
        return;
      }

      return storeData.data;
    }
  },

  remove(queryKey: QueryKey) {
    localStorage && localStorage.removeItem(queryKey);
  },
};

export const sessionStorageCache = {
  set(name: string, data: any, expire: number) {
    const storeData = {
      data,
      expire,
    };

    sessionStorage && sessionStorage.setItem(name, JSON.stringify(storeData));
  },

  get(queryKey: QueryKey) {
    const storeData =
      sessionStorage && JSON.parse(sessionStorage.getItem(queryKey) || "{}");

    const now = Date.now();
    if (storeData) {
      if (storeData.expire && storeData.expire - now < 0) {
        return;
      }

      return storeData.data;
    }
  },

  remove(queryKey: QueryKey) {
    sessionStorage && sessionStorage.removeItem(queryKey);
  },
};

export const reduxStorageCache = {
  set(name: string, data: any, expire: number) {
    const storeData = {
      data,
      expire,
    };

    store.dispatch(setCache({ name, data: storeData }));
  },

  get(queryKey: QueryKey) {
    const storeData = store.getState().cache[queryKey];
    const now = Date.now();
    if (storeData) {
      if (storeData.expire && storeData.expire - now < 0) {
        return;
      }

      return storeData.data;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  remove(queryKey: QueryKey) {},
};
