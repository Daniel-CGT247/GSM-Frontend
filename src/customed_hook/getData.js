import axios from "axios";
import { useEffect, useState } from "react";
import headers from "../headers";

export default function useGet(endpoint, params, deps) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("access_token") === null) {
        window.location.href = "/login";
      }
      getData();
    } catch (error) {
      setIsLoading(false);
      console.log("Error:", error);
    }
  }, [deps]);

  let getData = async () => {
    let res = await axios.get(`${endpoint}`, {
      params: params,
      headers: headers,
    });
    setData(res.data);
    setIsLoading(false);
  };

  return { isLoading, data };
}
