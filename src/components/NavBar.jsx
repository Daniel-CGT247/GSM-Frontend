import { Flex, Image, Text, Link } from "@chakra-ui/react";
import BrandLogo from "../images/Canada-Goose-Logo.png";
import SignInSignOutButton from "./SignInSignOutButton";
import WelcomeName from "./WelcomeName";

const navs = [
  {
    name: "Collection",
    path: "/",
  },
  {
    name: "New Item",
    path: "/new-item",
  },
];
export default function Navigation() {
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
          <Text fontWeight="bold" m={0} p={0} fontSize="lg">
            GSM Project
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-around" gap={4}>
          {navs.map((nav, index) => (
            <Link key={index} href={nav.path}>
              <Text fontSize="lg">{nav.name}</Text>
            </Link>
          ))}
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-around" gap={4}>
        <WelcomeName />
        <SignInSignOutButton />
      </Flex>
    </Flex>
  );
}
