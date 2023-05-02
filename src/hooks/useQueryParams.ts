import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

interface Params {
  [key: string]: any | undefined;
}

const useQueryParams = <T extends Params>(
  defaultParams: T
): [T, (paramsObj: T) => void] => {
  //===== đưa tất cả searchParam vào params =====
  const params: T = { ...defaultParams };
  const [searchParam, setSearchParam] = useSearchParams();

  for (const [key, val] of searchParam.entries()) {
    try {
      params[key as keyof T] = JSON.parse(val || defaultParams[key]);
    } catch (error) {
      params[key as keyof T] = val || defaultParams[key];
    }
  }
  // để giữ những giá trị cũ

  const setParams = (paramsObj: T) => {
    const qs = queryString.stringify({ ...params, ...paramsObj });
    setSearchParam(qs);
  };

  return [params, setParams];
};

export default useQueryParams;
