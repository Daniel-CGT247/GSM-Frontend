import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import endpoint from "../utils/endpoint";
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  HStack,
  Center,
  Text
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

export default function ElementLib() {
  const [elementLibList, setElementLibList] = useState([]); // list of elements
  const [selectedElements, setSelectedElements] = useState([]); 
  const { listId, operationId, operationListId } = useParams();
  
  const handleAddElement = async (
    elementId,
    selectedOptions,
    userExpandingName
  ) => {
    const selectedElement = elementLibList.find(
      (element) => element.id === elementId
    );
    if (!selectedElement) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }

    const uniqueId = Date.now();
    const newElement = {
      ...selectedElement,
      selectedOptions: {},
      uniqueId: uniqueId,
      time: "Fetching...",
      expandingName:
        userExpandingName || selectedElement.expandingName || "N/A",
    };

    selectedElement.variables.forEach((variable) => {
      const selectedOptionId = parseInt(
        selectedOptions[`${elementId}_${variable.name}`],
        10
      );
      newElement.selectedOptions[variable.name] = selectedOptionId;
    });

    try {
      const postData = {
        listItem: operationListId,
        elements: newElement.id,
        expanding_name: newElement.expandingName,
        options: Object.values(newElement.selectedOptions),
        
      };

      const addResponse = await axios.post(
        `${endpoint}/element_list/`,
        postData,
        { headers: { Authorization: `JWT ${localStorage.getItem("access_token")}`} }
      );

      const addedElement = {
        ...newElement,
        uniqueId: addResponse.data.id || uniqueId,
      };

      setSelectedElements((prevElements) => [...prevElements, addedElement]);

      const response = await axios.get(`${endpoint}/element_list/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      const fetchedElement = response.data.find(
        (item) => item.id === addedElement.uniqueId
      );

      const fetchedTime = fetchedElement
        ? (parseFloat(fetchedElement.nmt) || 0).toFixed(4)
        : "N/A";

      setSelectedElements((prevElements) =>
        prevElements.map((el) =>
          el.uniqueId === addedElement.uniqueId
            ? { ...el, time: fetchedTime }
            : el
        )
      );
    } catch (error) {
      console.error("Error in adding element", error);

      setSelectedElements((prevElements) =>
        prevElements.map((el) =>
          el.uniqueId === newElement.uniqueId
            ? { ...el, time: "Error fetching time" }
            : el
        )
      );
    }
  };

  //==============================================
  // - show available options in variables 
  //==============================================
  const [visibleOptions, setVisibleOptions] = useState({});

  const toggleOptionsVisibility = (elementId) => {
    setVisibleOptions((prevVisibleOptions) => ({
      ...prevVisibleOptions,
      [elementId]: !prevVisibleOptions[elementId],
    }));
  };

  const [selectedVariables, setSelectedVariables] = useState({});
  const handleVariableChange = (elementId, variableName, selectedOptionId) => {
    setSelectedVariables((prevSelectedVariables) => ({
      ...prevSelectedVariables,
      [`${elementId}_${variableName}`]: selectedOptionId,
    }));
  };

  const areAllVariablesSelected = (elementId) => {
    const elementVariables =
      elementLibList.find((element) => element.id === elementId)?.variables ||
      [];
    return elementVariables.every((variable) =>
      selectedVariables.hasOwnProperty(`${elementId}_${variable.name}`)
    );
  };

  const saveSelectedElementsToLocalStorage = (elements) => {
    localStorage.setItem("selectedElements", JSON.stringify(elements));
  };


  const handleExpandingNameChange = (uniqueId, expandingName) => {
    const updatedSelectedElements = selectedElements.map((element) =>
      element.uniqueId === uniqueId ? { ...element, expandingName } : element
    );

    setSelectedElements(updatedSelectedElements);
    saveSelectedElementsToLocalStorage(updatedSelectedElements);
  };
  //==============================================
  // - pagination
  //==============================================
  const [searchFilter, setSearchFilter] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const pageCount = Math.ceil(elementLibList.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/element_lib/`, {
          params: {
            operation_id: operationId,
            listId: listId, 
          },
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        });

        const filteredElements = response.data.filter(element => element.operation.includes(parseInt(operationId)));
  
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
  }, [operationId, listId]); 

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">Operation Library</Text>
          </Center>
        <Table variant="simple" >
          <Thead>
              <Tr>
                <Th style={{ width: "5%" }}>#</Th>
                <Th style={{ width: "30%" }}>Name</Th>
                <Th style={{ width: "45%" }}>Options</Th>
                <Th style={{ width: "10%" }}>Add</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((element, index) => (
                <Tr key={element.id}>
                  <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
                  <Td>{element.name}</Td>
                  <Td>
                    {element.variables && element.variables.length > 0 ? (
                      <IconButton
                        aria-label="Options"
                        icon={element.isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        onClick={() => toggleOptionsVisibility(element.id)}
                        variant="ghost"
                      />
                    ) : (
                      'N/A'
                    )}
                  </Td>
                  <Td>
                    <Button size="sm" onClick={() => handleAddElement(element.id)}>
                      Add
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
        </Table>
      </Box>
      
      <Flex justify="center" align="center" p="4" boxShadow="base" rounded="md" bg="white">
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
        />
        <HStack spacing="20px" mx="4">
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i + 1}
              colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </HStack>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
          isDisabled={currentPage >= pageCount}
        />
      </Flex>
    </Flex>
  );
}
