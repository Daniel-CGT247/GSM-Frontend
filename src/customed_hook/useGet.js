import axios from "axios";
import { useEffect, useState } from "react";
import useHeaders from "./useHeader";
import { useAuth } from "../authConfig";

export default function useGet(endpoint, params, deps) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const headers = useHeaders();
  const [accessToken, setToken] = useState("");
  useAuth(accessToken, setToken);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  useEffect(() => {
    setLoading(true);

    axios
      .get(endpoint, { params: params, headers: headers })
      // .get(endpoint, { params: params })
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log("DATA: ", data);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [...deps]);

  return { data, isLoading, error, setData };
}
