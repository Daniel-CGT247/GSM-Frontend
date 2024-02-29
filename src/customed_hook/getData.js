import axios from "axios";
import { useEffect, useState } from "react";

export default function useGet(endpoint) {
  const [data, setData] = useState([]);
  const headers = {
    Authorization: `JWT ${localStorage.getItem("access_token")}`,
  };

  useEffect(() => {
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    }
    getData();
  }, []);

  let getData = async () => {
    let res = await axios.get(`${endpoint}`, { headers });
    setData(res.data);
  };

  return data;
}