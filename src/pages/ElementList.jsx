import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
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
import TableSkeleton from "../components/TableSkeleton";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

export default function ElementList({ onTotalTimeUpdate }) {
  const [selectedElements, setSelectedElements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchFilter, setSearchFilter] = useState("");
  const [expandingNamesList, setExpandingNamesList] = useState([]);
  const [newExpandingName, setNewExpandingName] = useState("");
  const { operationListId } = useParams();
  const [isListLoading, setIsListLoading] = useState(false);
  const headers = useHeaders();

  // - calculate total sam
  useEffect(() => {
    const total = selectedElements.reduce((acc, curr) => {
      const timeValue = parseFloat(curr.time);
      return acc + (isNaN(timeValue) ? 0 : timeValue);
    }, 0);
    onTotalTimeUpdate(total);
  }, [selectedElements, onTotalTimeUpdate]);

  const handleSearchChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleExpandingNameChange = async (uniqueId, newExpandingName) => {
    setSelectedElements((prevElements) =>
      prevElements.map((element) =>
        element.uniqueId === uniqueId
          ? { ...element, expandingName: newExpandingName }
          : element
      )
    );

    try {
      await axios.patch(
        `${endpoint}/element_list/${uniqueId}/`,
        { expanding_name: newExpandingName },
        { headers }
      );
    } catch (error) {
      console.error("Error updating expanding name:", error);
    }
  };

  const handleAddNewExpandingName = async (uniqueId) => {
    if (newExpandingName.trim() !== "") {
      setNewExpandingName("");
      const selectedElement = selectedElements.find(
        (element) => element.uniqueId === uniqueId
      );
      if (!selectedElement) {
        console.error(`Element with uniqueId ${uniqueId} not found.`);
        return;
      }
      try {
        const response = await axios.patch(
          `${endpoint}/element_list/${selectedElement.uniqueId}/`,
          { expanding_name: newExpandingName },
          { headers }
        );
        console.log("Expanding name added successfully:", response.data);

        const updatedSelectedElements = selectedElements.map((element) =>
          element.uniqueId === uniqueId
            ? { ...element, expandingName: newExpandingName }
            : element
        );
        setSelectedElements(updatedSelectedElements);

        if (!expandingNamesList.includes(newExpandingName)) {
          setExpandingNamesList([...expandingNamesList, newExpandingName]);
        }

        saveSelectedElementsToLocalStorage(updatedSelectedElements);
      } catch (error) {
        console.error("Error adding expanding name:", error);
      }
    }
  };

  const handleDeleteElement = async (elementId) => {
    try {
      const response = await axios.delete(
        `${endpoint}/element_list/${elementId}/`,
        {
          headers: headers,
        }
      );
      if (response.status >= 200 && response.status < 300) {
        setSelectedElements((prevElements) =>
          prevElements.filter((element) => element.uniqueId !== elementId)
        );
        saveSelectedElementsToLocalStorage(selectedElements);
      } else {
        throw new Error("Failed to delete the element from the backend.");
      }
    } catch (error) {
      console.error("Error deleting element:", error);
    }
  };

  const saveSelectedElementsToLocalStorage = (elements) => {
    localStorage.setItem("selectedElements", JSON.stringify(elements));
  };

  useEffect(() => {
    setIsListLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/element_list/`, {
          params: { listItem_id: operationListId },
          headers: headers,
        });
        const combinedData = response.data.map((item) => ({
          uniqueId: item.id,
          id: item.elements.id,
          name: item.elements.name,
          expandingName: item.expanding_name || "N/A",
          time: item.nmt ? parseFloat(item.nmt).toFixed(4) : "N/A",
          selectedOptions: item.options.reduce((acc, curr) => {
            acc[curr.name] = curr.name;
            return acc;
          }, {}),
        }));
        setSelectedElements(combinedData);
        setIsListLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsListLoading(false);
      }
    };
    fetchData();
  }, [operationListId, headers]);

  useEffect(() => {
    const fetchExpandingNames = async () => {
      try {
        const elementListResponse = await axios.get(
          `${endpoint}/element_list/`,
          {
            params: { listItem_id: operationListId },
            headers: headers,
          }
        );
        const uniqueExpandingNames = [
          ...new Set(
            elementListResponse.data.map((item) => item.expanding_name)
          ),
        ];
        setExpandingNamesList(
          uniqueExpandingNames.filter((name) => name !== null)
        );
      } catch (error) {
        console.error("Error fetching expanding names:", error);
      }
    };
    fetchExpandingNames();
  }, [operationListId, headers]);

  // const pageCount = Math.ceil(selectedElements.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = selectedElements.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );

  const filteredElements = selectedElements.filter((element) =>
    element.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const pageCount = Math.ceil(filteredElements.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredElements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      {isListLoading ? (
        <TableSkeleton
          header="Element List"
          columns={["Name", "Expanding Field", "Time", "Selected Options"]}
        />
      ) : (
        <Card>
          <CardBody>
            <Flex direction="column" maxW="4xl" margin="auto">
              <Box height="650px" overflowY="auto" maxH="75vh" mb="4">
                <Flex justifyContent="space-between" alignItems="center" mb="4">
                  <Text color="gray.700" fontWeight="bold" fontSize="xl">
                    Element List
                  </Text>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Text color="gray">
                      Page{" "}
                      <span style={{ fontWeight: "bold" }}>{currentPage}</span>{" "}
                      of {pageCount}
                    </Text>
                    <IconButton
                      size="sm"
                      icon={<ChevronLeftIcon />}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      isDisabled={currentPage === 1}
                    />
                    <IconButton
                      size="sm"
                      icon={<ChevronRightIcon />}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                      }
                      isDisabled={currentPage >= pageCount}
                    />
                  </Flex>
                </Flex>

                <InputGroup mb="4">
                  <InputLeftElement pointerEvents="none">
                    <Search2Icon />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by name"
                    onChange={handleSearchChange}
                    value={searchFilter}
                  />
                  {searchFilter && (
                    <InputRightElement>
                      <Box as="button" onClick={() => setSearchFilter("")}>
                        <CloseIcon boxSize="3" />
                      </Box>
                    </InputRightElement>
                  )}
                </InputGroup>

                <Table variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th style={{ width: "2%" }}>#</Th>
                      <Th style={{ width: "45%" }}>Name</Th>
                      <Th style={{ width: "15%" }}>Expanding Field</Th>
                      <Th style={{ width: "10%" }}>Time</Th>
                      <Th style={{ width: "50%" }}>Selected Options</Th>
                      <Th style={{ width: "8%" }}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentItems.map((element, index) => (
                      <Tr key={element.uniqueId}>
                        <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
                        <Td>{element.name}</Td>
                        <Td>
                          <select
                            value={element.expandingName}
                            onChange={(e) =>
                              handleExpandingNameChange(
                                element.uniqueId,
                                e.target.value
                              )
                            }
                          >
                            <option value="N/A">N/A</option>
                            {expandingNamesList.map((expandingName) => (
                              <option key={expandingName} value={expandingName}>
                                {expandingName}
                              </option>
                            ))}
                            <option value="__ADD_NEW__">Add New...</option>
                          </select>
                          {element.expandingName === "__ADD_NEW__" && (
                            <div className="mt-2">
                              <textarea
                                value={newExpandingName}
                                onChange={(e) =>
                                  setNewExpandingName(e.target.value)
                                }
                                placeholder="Enter new expanding field"
                                style={{
                                  width: "130px",
                                  minHeight: "35px",
                                  resize: "none",
                                }}
                              />
                              <Button
                                size="sm"
                                colorScheme="teal"
                                ml="2"
                                onClick={() =>
                                  handleAddNewExpandingName(element.uniqueId)
                                }
                              >
                                Add
                              </Button>
                            </div>
                          )}
                        </Td>
                        <Td>{element.time}</Td>
                        <Td>
                          {Object.keys(element.selectedOptions).join(", ")}
                        </Td>

                        <Td>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() =>
                              handleDeleteElement(element.uniqueId)
                            }
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      )}
    </>
  );
}
