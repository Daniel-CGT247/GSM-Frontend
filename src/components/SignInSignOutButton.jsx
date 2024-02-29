import { SignInButton } from "./SignInButton.jsx";
import { SignOutButton } from "./SignOutButton.jsx";
import { useIsAuthenticated } from "@azure/msal-react";

export function SignInSignOutButton() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      {isAuthenticated && <SignOutButton />}
      {!isAuthenticated && <SignInButton />}
    </>
  );
}

export default SignInSignOutButton;
