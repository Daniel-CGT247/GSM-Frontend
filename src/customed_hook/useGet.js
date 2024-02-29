import axios from "axios";
import { useEffect, useState } from "react";
import useHeaders from "./useHeader";

export default function useGet(endpoint, params, deps) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const headers = useHeaders();
  useEffect(() => {
    setLoading(true);
    headers.Authorization &&
      axios
        .get(endpoint, { params: params, headers: headers })
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
  }, [...(deps ?? []), headers]);

  return { data, isLoading, error, setData };
}
