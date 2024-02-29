import { useState } from "react";
import { useAuth } from "../authConfig";
import { useEffect } from "react";

export default function useHeaders() {
  const [headers, setHeaders] = useState({});
  const [accessToken, setToken] = useState("");

  useAuth(accessToken, setToken);
  useEffect(() => {
    accessToken &&
      setHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      });
  }, [accessToken]);
  return headers;
}
