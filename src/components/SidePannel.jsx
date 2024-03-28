// import { Flex, Icon, Link, Text, Tooltip } from "@chakra-ui/react";
// import { IoIosAddCircleOutline } from "react-icons/io";
// import { RiAdminLine } from "react-icons/ri";
// import { TbJacket } from "react-icons/tb";
// import { HiQuestionMarkCircle } from "react-icons/hi";

// export default function SidePannel({ isOpen }) {
//   const navs = [
//     {
//       name: "Collection",
//       path: "/",
//       icon: TbJacket,
//       isExternal: false,
//     },
//     {
//       name: "New Item",
//       path: "/new-item",
//       icon: IoIosAddCircleOutline,
//       isExternal: false,
//     },
//     {
//       name: "Admin",
//       path: "http://localhost:8000/admin/",
//       icon: RiAdminLine,
//       isExternal: true,
//     },
//     {
//       name: "Support",
//       path: "http://localhost:3000/support",
//       icon: HiQuestionMarkCircle,
//       isExternal: false,
//     },
//   ];

//   return (
//     <Flex
//       flexDirection="column"
//       w={isOpen ? "200px" : "50px"}
//       h="100vh"
//       mt="50px"
//       py={5}
//       bgColor="#3c3744"
//     >
//       <Flex flexDirection="column" alignItems="start" gap={3} p={0}>
//         {navs.map((nav, index) => (
//           <Tooltip
//             key={index}
//             background="#3c3744"
//             hasArrow
//             label={nav.name}
//             placement="right"
//             isDisabled={isOpen}
//           >
//             <Link
//               key={index}
//               href={nav.path}
//               isExternal={nav.isExternal}
//               w={isOpen ? "100%" : ""}
//               _hover={{ bgColor: "#888098" }}
//               transition="all 0.3s ease-in-out"
//             >
//               <Flex alignItems="center" gap={2} p={2} ml={1} opacity="0.9">
//                 <Icon color="white" as={nav.icon} boxSize={7} />
//                 {isOpen && <Text color="white">{nav.name}</Text>}
//               </Flex>
//             </Link>
//           </Tooltip>
//         ))}
//       </Flex>
//     </Flex>
//   );
// }
// // import React, { useState, useEffect } from 'react';
// // import { Flex, Icon, Link, Text, Tooltip } from "@chakra-ui/react";
// // import { IoIosAddCircleOutline } from "react-icons/io";
// // import { RiAdminLine } from "react-icons/ri";
// // import { TbJacket } from "react-icons/tb";
// // import { HiQuestionMarkCircle } from "react-icons/hi";

// // export default function SidePannel() {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isHovered, setIsHovered] = useState(false);

// //    useEffect(() => {
// //     if (isHovered) {
// //       setIsOpen(true);
// //     } else {
// //       setIsOpen(false);
// //     }
// //   }, [isHovered]);


// //   const navs = [
// //     {
// //       name: "Collection",
// //       path: "/",
// //       icon: TbJacket,
// //       isExternal: false,
// //     },
// //     {
// //       name: "New Item",
// //       path: "/new-item",
// //       icon: IoIosAddCircleOutline,
// //       isExternal: false,
// //     },
// //     {
// //       name: "Admin",
// //       path: "http://localhost:8000/admin/",
// //       icon: RiAdminLine,
// //       isExternal: true,
// //     },
// //     {
// //       name: "Support",
// //       path: "http://localhost:3000/support",
// //       icon: HiQuestionMarkCircle,
// //       isExternal: false,
// //     },
// //   ];

// //   return (
// //     <Flex
// //       flexDirection="column"
// //       w={isOpen ? "200px" : "50px"}
// //       h="100vh"
// //       mt="50px"
// //       py={5}
// //       bgColor="#3c3744"
// //       onMouseEnter={() => setIsHovered(true)} 
// //       onMouseLeave={() => setIsHovered(false)} 
// //     >
// //       <Flex flexDirection="column" alignItems="start" gap={3} p={0}>
// //         {navs.map((nav, index) => (
// //           <Tooltip
// //             key={index}
// //             background="#3c3744"
// //             hasArrow
// //             label={nav.name}
// //             placement="right"
// //             isDisabled={isOpen}
// //           >
// //             <Link
// //               key={index}
// //               href={nav.path}
// //               isExternal={nav.isExternal}
// //               w={isOpen ? "100%" : ""}
// //               _hover={{ bgColor: "#888098" }}
// //               transition="all 0.3s ease-in-out"
// //             >
// //               <Flex alignItems="center" gap={2} p={2} ml={1} opacity="0.9">
// //                 <Icon color="white" as={nav.icon} boxSize={7} />
// //                 {isOpen && <Text color="white">{nav.name}</Text>}
// //               </Flex>
// //             </Link>
// //           </Tooltip>
// //         ))}
// //       </Flex>
// //     </Flex>
// //   );
// // }
import React, { useState, useEffect } from "react";
import {
  Link,
  Flex,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Image,
} from "@chakra-ui/react";
import { RiAdminLine } from "react-icons/ri";
import { TbJacket } from "react-icons/tb";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5";
import endpoint from "../utils/endpoint";
import axios from "axios";
import useHeaders from "../customed_hook/useHeader";

export default function SidePanel({ isOpen }) {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [imageData, setImageData] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const headers = useHeaders();

  useEffect(() => {
    const savedImageData = JSON.parse(localStorage.getItem("savedImageData"));
    if (savedImageData && savedImageData.length > 0) {
      setImageData(savedImageData);
    } else {
      const fetchImageData = async () => {
        try {
          const response = await axios.get(
            `${endpoint}/special_machine_instruction/`,
            {
              headers: headers,
            },
          );
          if (response.data.length > 0) {
            localStorage.setItem(
              "savedImageData",
              JSON.stringify(response.data),
            );
            setImageData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch image data:", error);
        }
      };

      fetchImageData();
    }
  }, []);

  const handleJobSelection = (job) => {
    setSelectedJob(job);
  };

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
    {
      name: "Note",
      icon: IoInformationCircle,
      action: onModalOpen,
    },
  ];

  const uniqueJobs = [...new Set(imageData.map((item) => item.job))];

  return (
    <>
      <Flex
        flexDirection="column"
        w={isOpen ? "200px" : "50px"}
        h="100vh"
        mt="50px"
        py={5}
        bgColor="#3c3744"
      >
        <Flex flexDirection="column" alignItems="start" gap={3} p={0}>
          {navs.map((nav, index) =>
            nav.name === "Note" ? (
              <Text
                as="button"
                onClick={nav.action}
                key={index}
                style={{ all: "unset" }}
              >
                <Flex alignItems="center" gap={2} p={2} ml={1} opacity="0.9">
                  <Icon color="white" as={nav.icon} boxSize={7} />
                  {isOpen && <Text color="white">{nav.name}</Text>}
                </Flex>
              </Text>
            ) : (
              <Tooltip
                key={index}
                background="#3c3744"
                hasArrow
                label={nav.name}
                placement="right"
                isDisabled={isOpen}
              >
                <Link
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
            ),
          )}
        </Flex>
      </Flex>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          onModalClose();
          setSelectedJob("");
        }}
      >
        <ModalOverlay />
        <ModalContent maxW="70%" minH="100vh">
          <ModalHeader>Image Gallery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap" justifyContent="center" mb={4}>
              {uniqueJobs.map((job) => (
                <Button
                  key={job}
                  onClick={() => handleJobSelection(job)}
                  colorScheme="teal"
                  size="sm"
                  mr={2}
                  mb={2}
                >
                  {job}
                </Button>
              ))}
            </Flex>
            {selectedJob &&
              imageData
                .filter(({ job }) => job === selectedJob)
                .map(({ id, job, image }) => (
                  <Flex key={id} direction="column" align="center" my={4}>
                    <Text fontSize="lg" fontWeight="bold">
                      {job}
                    </Text>
                    <Image src={image} alt={`Instruction for ${job}`} />
                  </Flex>
                ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
