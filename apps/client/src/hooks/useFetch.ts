import { useEffect, useState } from "react";
import instance from "@/config/axios.config";
import { AxiosError } from "axios";

interface FetchState<T> {
  data: T | null;
  error: AxiosError | Error | null;
  loading: boolean;
}

export const useFetch = <T>(url: string): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    instance
      .get<T>(url)
      .then((response) => {
        setState({ data: response.data, error: null, loading: false });
      })
      .catch((error) => {
        setState({ data: null, error, loading: false });
      });
  }, [url]);

  return state;
};
