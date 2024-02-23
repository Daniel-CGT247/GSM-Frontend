import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import {
  InteractionStatus,
  InteractionType,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../utils/MsGraphApiCall";
import { useEffect, useState } from "react";

export default function BlankPage() {
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = useState(null);

  return <h1 className="font-bold">Welcome to the blank page</h1>;
}
