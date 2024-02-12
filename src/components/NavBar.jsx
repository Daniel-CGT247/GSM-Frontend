import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import userAuth from "../customed_hook/useAuth";
import BrandLogo from "../images/Canada-Goose-Logo.png";
export default function Navigation() {
  const user = userAuth();

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsAuth(true);
    }
  }, [user]);
  const navs = [
    { name: "Collection", href: "/collection" },
    { name: "Build New Item", href: "/new-item" },
    { name: "Logout", href: "/Logout" }, 
  ];
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={4}
      pos="sticky"
      top={0}
      zIndex={10}
      bgColor="gray.300"
    >
      <Flex alignItems="center" gap={10}>
        <Flex alignItems="center">
          <Image src={BrandLogo} w="80px" alt="brand-logo" /> 
          <Text m={0} p={0} as="h5">
            GSM Project
          </Text>
        </Flex>
        {isAuth && (
          <Flex justifyContent="space-between" gap={5}>
            {navs.map((nav) => (
              <Link href={nav.href} key={nav.href}>
                <Text m={0} p={0} fontSize="lg" color="gray.500">
                  {nav.name}
                </Text>
              </Link>
            ))}
          </Flex>
        )}
      </Flex>
      {isAuth && (
        <Text fontSize="md" m={0} p={0} color="gray.500">
          Welcome back, {user?.username}
        </Text>
      )}
    </Flex>
  );
}
