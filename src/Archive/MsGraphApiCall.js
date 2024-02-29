import { loginRequest } from "../authConfig";
import { msalInstance } from "../index";
import axios from "axios";
import { useEffect, useState } from "react";

export async function callMsGraph(accessToken, endpoint, deps) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!accessToken) {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      throw Error(
        "No active account! Verify a user has been signed in and setActiveAccount has been called."
      );
    }

    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    });
    accessToken = response.accessToken;
  }

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  useEffect(() => {
    setLoading(true);
    axios
      .get(endpoint, { headers: headers })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [accessToken, deps]);

  return data, isLoading, error;
}
