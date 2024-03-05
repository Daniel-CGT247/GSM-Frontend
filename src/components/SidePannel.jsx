import { Flex, Icon, Text, Link } from "@chakra-ui/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";
import { TbJacket } from "react-icons/tb";

export default function SidePannel({ isOpen }) {
  const navs = [
    {
      name: "Collection",
      path: "/",
      icon: TbJacket,
      isExternal: false,
    },
    {
      name: "New Item",
      path: "/new-item",
      icon: IoIosAddCircleOutline,
      isExternal: false,
    },
    {
      name: "Admin",
      path: "http://localhost:8000/admin",
      icon: RiAdminLine,
      isExternal: true,
    },
  ];

  return (
    <Flex
      flexDirection="column"
      w={isOpen ? "200px" : "50px"}
      h="100vh"
      mt="50px"
      py={5}
      bgColor="#3c3744"
    >
      <Flex flexDirection="column" alignItems="start" gap={3} p={0}>
        {navs.map((nav, index) => (
          <Link
            key={index}
            href={nav.path}
            isExternal={nav.isExternal}
            w={isOpen ? "100%" : ""}
            _hover={{ bgColor: "#888098" }}
          >
            <Flex alignItems="center" gap={2} p={2} ml={1} opacity="0.9">
              <Icon color="white" as={nav.icon} boxSize={7} />
              {isOpen && <Text color="white">{nav.name}</Text>}
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
