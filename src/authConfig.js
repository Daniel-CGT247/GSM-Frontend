import { LogLevel } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "98dea2d8-453e-4a4d-bba1-fefc2f4e144c", // This is the ONLY mandatory field that you need to supply.
    authority:
      "https://login.microsoftonline.com/e500d90a-f722-4c6b-a5b8-6fda28cef811", // Replace the placeholder with your tenant subdomain
    redirectUri: "http://localhost:3000", // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
    postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
  // scopes: ["User.Read", "openid", "email", "profile", "offline_access"],
};

export function useAuth(token, setToken) {
  const { instance, accounts } = useMsal();
  if (!token) {
    const request = {
      scopes: ["User.Read", "openid", "email", "profile", "offline_access"],
      // scopes: ["User.Read"],
      account: accounts[0],
    };
    instance
      .acquireTokenSilent(request)
      .then((tokenResponse) => {
        setToken(tokenResponse.accessToken);
      })
      .catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect(request).then(function (response) {
            setToken(response.accessToken);
          });
          console.error(error);
        }
      });
  }
}
