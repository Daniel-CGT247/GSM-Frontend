import { ChevronUpIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Collapse,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

export default function ElementLib(props) {
  const [elementLibList, setElementLibList] = useState([]);
  const { operationId, operationListId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState("");
  const [visibleOptions, setVisibleOptions] = useState({});
  const [selectedElements, setSelectedElements] = useState([]); 

  const headers = useHeaders();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/element_lib/`, {
          params: { operation: operationId },
          headers: headers,
        });
        const updatedElementLibList = response.data.map((element) => ({
          ...element,
          variables: element.variables.map((variable) => ({
            ...variable,
            options: variable.options.map((option) => ({
              id: option.id,
              name: option.name,
            })),
          })),
        }));
        setElementLibList(updatedElementLibList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [operationId, headers]);

  const toggleOptionsVisibility = (elementId) => {
    setVisibleOptions((prevVisibleOptions) => ({
      ...prevVisibleOptions,
      [elementId]: !prevVisibleOptions[elementId],
    }));
  };

const handleAddElement = async (
  elementId, 
  selectedOptions, 
  userExpandingName
  ) => {
  // Find the selected element from the list
  const selectedElement = elementLibList.find(element => element.id === elementId);
  if (!selectedElement) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  const uniqueId = Date.now();
  const newElement = {
    ...selectedElement,
    selectedOptions: {},
    uniqueId,
    time: "Fetching...",
    expandingName: userExpandingName || selectedElement.expandingName || "N/A",
  };

  selectedElement.variables.forEach(variable => {
    const selectedOptionId = parseInt(selectedOptions[`${elementId}_${variable.name}`], 10);
    newElement.selectedOptions[variable.name] = selectedOptionId;
  });

  try {
    const postData = {
      listItem: operationListId,
      elements: newElement.id,
      expanding_name: newElement.expandingName,
      options: Object.values(newElement.selectedOptions),
    };

    const addResponse = await axios.post(`${endpoint}/element_list/`, 
      postData, 
      { headers: headers }
    );
    
    const addedElement = { ...newElement, uniqueId: addResponse.data.id || uniqueId };

    setSelectedElements(prevElements => {
      const updatedElements = [...prevElements, addedElement];
      localStorage.setItem("selectedElements", JSON.stringify(updatedElements));        
      props.updateSelectedElements(addedElement);

      return updatedElements;
    });

  } catch (error) {
    console.error("Error in adding element", error);
  }
};


  const [selectedVariables, setSelectedVariables] = useState({});
  const handleVariableChange = (elementId, variableName, selectedOptionId) => {
    setSelectedVariables((prevSelectedVariables) => ({
      ...prevSelectedVariables,
      [`${elementId}_${variableName}`]: selectedOptionId,
    }));
  };

  // const areAllVariablesSelected = (elementId) => {
  //   const elementVariables =
  //     elementLibList.find((element) => element.id === elementId)?.variables ||
  //     [];
  //   return elementVariables.every((variable) =>
  //     selectedVariables.hasOwnProperty(`${elementId}_${variable.name}`)
  //   );
  // };

  const areAllVariablesSelected = (elementId) => {
    const element = elementLibList.find((e) => e.id === elementId);
    return element?.variables.every((variable) =>
      selectedVariables.hasOwnProperty(`${elementId}_${variable.name}`) && selectedVariables[`${elementId}_${variable.name}`] !== ""
    );
  };

  const filteredElements = searchFilter
  ? elementLibList.filter((element) =>
      element.name.toLowerCase().includes(searchFilter.toLowerCase())
    )
  : elementLibList;

  const handleSearchChange = (event) => {
    setSearchFilter(event.target.value);
  };


  const pageCount = Math.ceil(filteredElements.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredElements.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Flex direction="column" maxW="4xl" margin="auto">
      <Box height="650px" overflowY="auto" maxH="50vh" mb="4">
        <Center flexGrow={1}>
          <Text color="gray.700" fontWeight="bold" fontSize="lg" mb="4">
            Element Library
          </Text>
        </Center>
        
        <InputGroup mb="4">
          <InputLeftElement pointerEvents="none">
            <Search2Icon />
          </InputLeftElement>
          <Input 
            placeholder="Search elements"
            onChange={handleSearchChange}
            value={searchFilter}
          />
        </InputGroup>

        <Table width="100%" variant="simple">
          <Thead>
            <Tr>
              <Th style={{ width: "5%" }}>#</Th>
              <Th style={{ width: "25%" }}>Name</Th> 
              <Th style={{ width: "30px"}}>Options</Th> 
              <Th style={{ width: "10%" }}>Action</Th>
             
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((element, index) => (
              <Tr key={element.id}>
                <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
                <Td>{element.name}</Td>
                <Td>
                  {element.variables.some(variable => variable.options.length) ? (
                    <>
                      <IconButton
                        icon={visibleOptions[element.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        onClick={() => toggleOptionsVisibility(element.id)}
                        aria-label="Toggle options visibility"
                        size="sm"
                      />
                      <Collapse in={visibleOptions[element.id]} animateOpacity>
                        <div style={{ marginTop: "8px" }}>
                          {element.variables.map((variable, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                              <label
                                htmlFor={variable.name}
                                style={{ fontWeight: '600', marginRight: '8px', minWidth: '100px' }}
                              >
                                {variable.name}:
                              </label>
                              <select
                                className="form-select"
                                id={variable.name}
                                onChange={(e) =>
                                  handleVariableChange(
                                    element.id,
                                    variable.name,
                                    e.target.value
                                  )
                                }
                                value={selectedVariables[`${element.id}_${variable.name}`] || ""}
                                style={{ width: 'auto', flex: '1' }}
                              >
                                <option value="">Select an option</option>
                                {variable.options.map((option, optionIndex) => (
                                  <option key={optionIndex} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </Collapse>
                    </>
                  ) : "None"}
                </Td>
                <Td>
                  <Button 
                    colorScheme="blue" 
                    size="sm" 
                    disabled={!areAllVariablesSelected(element.id)}
                    onClick={() => handleAddElement(element.id, selectedVariables, "")}
                  >
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
        <Flex overflowX="auto">
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              mx="1"
              key={i + 1}
              colorScheme={currentPage === i + 1 ? "blue" : "gray"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </Flex>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
          isDisabled={currentPage >= pageCount}
        />
      </Flex>
    </Flex>
  );
}  
