import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { msalConfig } from "./authConfig";
import "./index.css";

export const pca = new PublicClientApplication(msalConfig);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <ChakraProvider>
        {/* <ThemeProvider theme={theme}> */}
        <App />
        {/* </ThemeProvider> */}
      </ChakraProvider>
    </MsalProvider>
  </React.StrictMode>
);
