import { Flex, IconButton, Image, Link, Text } from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";
import BrandLogo from "../images/Canada-Goose-Logo.png";
import SignInSignOutButton from "./SignInSignOutButton";
import WelcomeName from "./WelcomeName";
export default function Navigation({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={2}
      bgColor="gray.300"
      h="50px"
    >
      <Flex alignItems="center" gap={10}>
        <Flex alignItems="center">
          <IconButton
            icon={<MdMenu />}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <Image src={BrandLogo} w="50px" alt="brand-logo" />
          <Text fontWeight="bold" m={0} p={0} fontSize="lg">
            GSM Project
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-around" gap={4}>
        <WelcomeName />
        <SignInSignOutButton />
      </Flex>
    </Flex>
  );
}
