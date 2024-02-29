import { useState } from "react";
import { useAuth } from "../authConfig";

export default function useHeaders() {
  const [accessToken, setToken] = useState("");
  useAuth(accessToken, setToken);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  return headers;
}
