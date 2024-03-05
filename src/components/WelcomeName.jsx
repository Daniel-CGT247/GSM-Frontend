import { useMsal } from "@azure/msal-react";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const WelcomeName = () => {
  const { instance } = useMsal();
  const [name, setName] = useState(null);

  const activeAccount = instance.getActiveAccount();
  useEffect(() => {
    if (activeAccount) {
      setName(activeAccount.name);
    } else {
      setName(null);
    }
  }, [activeAccount]);

  if (name) {
    return <Text fontSize="md">Welcome, {name}</Text>;
  } else {
    return null;
  }
};

export default WelcomeName;
