import { Flex, Icon, Link, Text, Tooltip } from "@chakra-ui/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";
import { TbJacket } from "react-icons/tb";
import { HiQuestionMarkCircle } from "react-icons/hi";

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
      path: "http://localhost:8000/admin/",
      icon: RiAdminLine,
      isExternal: true,
    },
    // {
    //   name: "Support",
    //   path: "http://localhost:3000/support",
    //   icon: HiQuestionMarkCircle,
    //   isExternal: true,
    // },
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
          <Tooltip
            key={index}
            background="#3c3744"
            hasArrow
            label={nav.name}
            placement="right"
            isDisabled={isOpen}
          >
            <Link
              key={index}
              href={nav.path}
              isExternal={nav.isExternal}
              w={isOpen ? "100%" : ""}
              _hover={{ bgColor: "#888098" }}
              transition="all 0.3s ease-in-out"
            >
              <Flex alignItems="center" gap={2} p={2} ml={1} opacity="0.9">
                <Icon color="white" as={nav.icon} boxSize={7} />
                {isOpen && <Text color="white">{nav.name}</Text>}
              </Flex>
            </Link>
          </Tooltip>
        ))}
      </Flex>
    </Flex>
  );
}
