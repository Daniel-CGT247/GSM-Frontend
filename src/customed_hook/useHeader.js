import { useAuth } from "../authConfig";
import { useState } from "react";

export default function useHeaders() {
  const [accessToken, setToken] = useState("");
  useAuth(accessToken, setToken);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  return headers;
}
