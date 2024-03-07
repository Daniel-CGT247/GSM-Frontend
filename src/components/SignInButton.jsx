import { useMsal } from "@azure/msal-react";
import { Button } from "@chakra-ui/react";
import { loginRequest } from "../authConfig";

export const SignInButton = () => {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div>
      <Button
        onClick={() => {
          handleLogin();
        }}
        colorScheme="facebook"
        size="sm"
      >
        Login
      </Button>
    </div>
  );
};
