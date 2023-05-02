import {
  localStorageCache,
  reduxStorageCache,
  sessionStorageCache,
} from "@/utils";
import { CanceledError } from "axios";
import { useEffect, useReducer, useRef } from "react";
import { delayDuration } from "@/utils";

const enum Types {
  SET_DATA = "setData",
  SET_LOADING = "setLoading",
  SET_ERROR = "setError",
  SET_STATUS = "setStatus",
}
type StatusType = "idle" | "success" | "error" | "pending";

interface StateType<Data> {
  data: Data;
  loading: boolean;
  error: string | null;
  status: StatusType;
}
type ActionType<Data> =
  | {
      type: Types.SET_DATA;
      payload: Data;
    }
  | {
      type: Types.SET_ERROR;
      payload: string;
    }
  | {
      type: Types.SET_LOADING;
      payload: boolean;
    }
  | {
      type: Types.SET_STATUS;
      payload: StatusType;
    };

type QueryReducer<Data> = (
  state: StateType<Data>,
  action: ActionType<Data>
) => StateType<Data>;

const queryReducer = <Data,>(
  state: StateType<Data>,
  { type, payload }: ActionType<Data>
) => {
  switch (type) {
    case Types.SET_DATA: {
      return { ...state, data: payload };
    }
    case Types.SET_LOADING: {
      return { ...state, loading: payload };
    }
    case Types.SET_ERROR: {
      return { ...state, error: payload };
    }
    case Types.SET_STATUS: {
      return { ...state, status: payload };
    }

    default:
      return state;
  }
};

const cache = {
  localStorage: localStorageCache,
  sessionStorage: sessionStorageCache,
  redux: reduxStorageCache,
};

const _asyncFunction: { [key: string]: Promise<any> | any } = {};

type UseQueryType<Data> = {
  queryFn: ({signal, params}: {signal: AbortSignal, params: any[]}) => Promise<Data>;
  queryKey: string | string[];
  cacheTime: number;
  dependencyList: any[];
  storage: "localStorage" | "sessionStorage" | "redux";
  limitDuration: number;
  onSuccess: (res: Data) => Promise<void>;
  onError: (error: Error) => void;
  enabled: boolean;
  keepPreviousData: boolean;
  keepStorage: boolean;
};

const useQuery = <Data,>({
  queryFn,
  queryKey,
  cacheTime,
  dependencyList,
  storage,
  limitDuration,
  onSuccess,
  onError,
  enabled = true,
  keepPreviousData = false,
  keepStorage = true,
}: UseQueryType<Data>) => {
  const [{ data, loading, error, status }, dispatch] = useReducer<
    QueryReducer<Data>
  >(queryReducer, {
    data: {} as Data,
    loading: enabled,
    error: new Error("").message,
    status: "idle",
  });
  const reFetchRef = useRef<boolean>(); //call api
  const _cache = cache[storage]; //storage
  const dataRef = useRef<{ [key: string]: Data }>({}); //keepPreviousData
  const controllerRef = useRef<AbortController>(new AbortController()); //cancelRequest axios
  const _queryKey = Array.isArray(queryKey)
    ? queryKey?.[0]
    : typeof queryKey === "string"
    ? queryKey
    : undefined;
  //====== cancel when out the page ====
  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof reFetchRef.current === "boolean") {
      reFetchRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencyList]);

  const getCacheDataOrPreviousData = () => {
    if (reFetchRef.current) return;
    //======= keep old data =======
    if (_queryKey) {
      if (keepPreviousData && dataRef.current[_queryKey]) {
        return dataRef.current[_queryKey];
      }
      // ===== tránh call lại api khi trùng queryKey ====
      if (_asyncFunction[_queryKey]) {
        return _asyncFunction[_queryKey];
      }

      if (_cache) {
        return _cache.get(_queryKey);
      }
    }

    return;
  };

  const setCacheDataOrPreviousData = (data: Data) => {
    if (_queryKey && data) {
      if (keepPreviousData) {
        dataRef.current[_queryKey] = data;
      }

      if (_cache) {
        const expire = cacheTime || 0 + Date.now();
        _cache.set(_queryKey, data, expire);
      }
    }
  };
  const clearPreviousData = (queryKey: string) => {
    if (keepPreviousData && dataRef.current[queryKey]) {
      delete dataRef.current[queryKey];
    }
  };
  const clearAllData = () => {
    dataRef.current = {};
    for (const key in _asyncFunction) {
      if (_asyncFunction.hasOwnProperty.call(_asyncFunction, key)) {
        delete _asyncFunction[key];
      }
    }
  };
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, queryKey, dependencyList]);

  const fetchData = async (...params: any[]) => {
    //hủy api cũ khi chưa call xong
    controllerRef.current.abort();
    //tạo signal api mới
    controllerRef.current = new AbortController();
    const startTime = Date.now();
    dispatch({ type: Types.SET_LOADING, payload: true });
    dispatch({ type: Types.SET_STATUS, payload: "pending" });
    try {
      let res;

      res = getCacheDataOrPreviousData();
// const a = controllerRef.current.signal
      if (!res) {
        // call api
        res = queryFn({ signal: controllerRef.current.signal, params });

        //==== gán dữ liệu cho _asyncFunction
        if (_queryKey && _asyncFunction) {
          _asyncFunction[_queryKey] = res;
        }
      }

      if (res instanceof Promise) {
        res = await res;
      }
      await delayDuration(startTime, limitDuration);
      if (res) {
        await onSuccess?.(res);
        dispatch({ type: Types.SET_DATA, payload: res });
        dispatch({ type: Types.SET_STATUS, payload: "success" });
        setCacheDataOrPreviousData(res);
        reFetchRef.current = false;
        dispatch({ type: Types.SET_LOADING, payload: false });

        if (!keepStorage) {
          if (typeof _queryKey === "string") delete _asyncFunction[_queryKey];
        }
        return res;
      }
    } catch (err) {
      // error = err;
      await delayDuration(startTime, limitDuration);
      // eslint-disable-next-line no-empty
      if (err instanceof CanceledError) {
      } else if (err instanceof Error) {
        onError?.(err);
        dispatch({ type: Types.SET_ERROR, payload: err.message });
        dispatch({ type: Types.SET_STATUS, payload: "error" });
        dispatch({ type: Types.SET_LOADING, payload: false });
        console.log(
          "%cerror useQuery.js line:153 ",
          "color: red; display: block; width: 100%;",
          err
        );
        throw err;
      }
    }
  };

  return {
    data,
    loading,
    error,
    status,
    fetchData,
    clearPreviousData,
    clearAllData,
  };
};
export default useQuery;
