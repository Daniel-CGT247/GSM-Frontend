import axios from "axios";
import { useEffect, useState } from "react";
import useHeaders from "./useHeader";
import { useAuth } from "../authConfig";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export default function useGet(endpoint, params, deps) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessToken, setToken] = useState("");
  const { instance, accounts } = useMsal();
  const [headers, setHheaders] = useState({});

  useEffect(() => {
    setLoading(true);
    if (!accessToken) {
      const tokenRequest = {
        scopes: [
          "api://43877c69-35ac-40ba-8b81-1d75c3aeff81/read",
          "User.Read",
        ],
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(tokenRequest)
        .then((tokenResponse) => {
          setToken(tokenResponse.accessToken);
          setHheaders({
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          });
        })

        .catch(async (error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenRedirect(tokenRequest)
              .then(function (response) {
                setToken(response.accessToken);
              });
            console.error(error);
          }
        });
    }

    accessToken &&
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
  }, [...(deps ?? []), headers, instance, accounts]);

  return { data, isLoading, error, setData };
}
