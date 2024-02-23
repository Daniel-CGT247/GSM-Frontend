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
    getData();
  }, [endpoint, deps]);

  let getData = () => {
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
  };

  return { data, isLoading, error, setData };
}

// if (!accessToken) {
//   const account = msalInstance.getActiveAccount();
//   if (!account) {
//     throw Error(
//       "No active account! Verify a user has been signed in and setActiveAccount has been called."
//     );
//   }

//   const response = await msalInstance.acquireTokenSilent({
//     ...loginRequest,
//     account: account,
//   });
//   accessToken = response.accessToken;
// }
