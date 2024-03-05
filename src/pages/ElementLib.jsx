import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

export default function ElementLib() {
  const [elementLibList, setElementLibList] = useState([]); // list of elements
  const { listId, operationId, operationListId } = useParams();

  const headers = useHeaders();
  const handleAddElement = async (elementId) => {
    try {
      const postData = {
        listItem: operationListId,
        elements: elementId,
        options: [],
      };

      await axios.post(`${endpoint}/element_list/`, postData, {
        headers: headers,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //==============================================
  // - show available options in variables
  //==============================================

  //==============================================
  // - pagination
  //==============================================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const pageCount = Math.ceil(elementLibList.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/element_lib/`, {
          params: {
            operation: operationId,
          },
          headers: headers,
        });

        const filteredElements = response.data.filter((element) =>
          element.operation.includes(parseInt(operationId))
        );

        const updatedElementLibList = filteredElements.map((element) => {
          return {
            ...element,
            variables: element.variables.map((variable) => {
              return {
                ...variable,
                options: variable.options.map((option) => {
                  return {
                    id: option.id,
                    name: option.name,
                  };
                }),
              };
            }),
          };
        });

        setElementLibList(updatedElementLibList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [operationId, listId, headers]);

  const [searchFilter, setSearchFilter] = useState("");

  const filteredElements = elementLibList.filter((element) =>
    element.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredElements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <Flex direction="column" maxW="4xl" margin="auto">
      <Box height="650px" overflowY="auto" maxH="50vh" mb="4">
        <Center>
          <Text fontSize="2xl" fontWeight="bold" color="gray.700">
            Element Library
          </Text>
        </Center>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th style={{ width: "2%" }}>#</Th>
              <Th style={{ width: "48%" }}>Name</Th>
              <Th style={{ width: "35%" }}>Options</Th>
              <Th style={{ width: "15%" }}>Add</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((element, index) => (
              <Tr key={element.id}>
                <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
                <Td>{element.name}</Td>
                <Td>
                  {element.variables && element.variables.length > 0
                    ? element.variables.map((variable) => (
                        <Select placeholder={variable.name} value="">
                          {variable.options.map((option) => (
                            <option value={option.name}>{option.name}</option>
                          ))}
                        </Select>
                      ))
                    : "N/A"}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleAddElement(element.id)}
                  >
                    Add
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex
        justify="center"
        align="center"
        p="4"
        boxShadow="base"
        rounded="md"
        bg="white"
      >
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        />
        <HStack spacing="20px" mx="4">
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i + 1}
              colorScheme={currentPage === i + 1 ? "blue" : "gray"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </HStack>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          isDisabled={currentPage >= pageCount}
        />
      </Flex>
    </Flex>
  );
}

// export function OptionMenu(variable) {
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   return (
//     <Menu>
//       {({ isOpen }) => (
//         <>
//           <Text>{variable.name}</Text>
//           <MenuButton
//             isActive={isOpen}
//             as={Button}
//             rightIcon={<FaChevronDown />}
//           >
//             {!selectedOptions ? "Options" : selectedOptions}
//           </MenuButton>
//           <MenuList>
//             <MenuOptionGroup
//               type="radio"
//               onChange={(value) => setSelectedOptions(value)}
//             >
//               {variable.options &&
//                 variable.options.map((option) => (
//                   <MenuItemOption key={option.id} value={option}>
//                     {option.name}
//                   </MenuItemOption>
//                 ))}
//             </MenuOptionGroup>
//           </MenuList>
//         </>
//       )}
//     </Menu>
//   );
// }
