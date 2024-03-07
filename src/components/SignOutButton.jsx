import { useMsal } from "@azure/msal-react";
import { Button } from "@chakra-ui/react";

export const SignOutButton = () => {
  const { instance } = useMsal();
  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div>
      <Button
        onClick={() => handleLogout()}
        colorScheme="facebook"
        variant="outline"
        size={"sm"}
      >
        Sign Out
      </Button>
    </div>
  );
};
