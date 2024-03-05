import {
  Box,
  Button,
  Center,
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

export default function ElementList() {
  const [elementLibList, setElementLibList] = useState([]); // list of elements
  const [selectedElements, setSelectedElements] = useState([]); // selected elements
  const [expandingNamesList, setExpandingNamesList] = useState([]); // concat input
  const { listId, operationId, operationListId } = useParams(); // extracts url param
  // const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const headers = useHeaders();
  const [totalSam, setTotalSam] = useState("Loading..."); // calculate total time

  //==============================================
  // - calculate total time
  //==============================================
  const calculateTotalSam = () => {
    const totalTime = selectedElements.reduce((total, element) => {
      const elementTime = parseFloat(element.time) || 0;
      return total + elementTime;
    }, 0);

    return totalTime.toFixed(2);
  };

  useEffect(() => {
    const finalTotalTime = calculateTotalSam();
    setTotalSam(finalTotalTime);
  }, [selectedElements]);

  useEffect(() => {
    axios
      .get(`${endpoint}/element_list/`, {
        params: {
          listItem_id: operationListId,
        },
        headers: headers,
      })

      .then((response) => {
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
        localStorage.setItem("selectedElements", JSON.stringify(combinedData));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [listId, operationListId, operationId, headers]);

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
  }, []);

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

  const saveSelectedElementsToLocalStorage = (elements) => {
    localStorage.setItem("selectedElements", JSON.stringify(elements));
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
      } else {
        throw new Error("Failed to delete the element from the backend.");
      }
    } catch (error) {
      console.error("Error deleting element:", error);
    }
  };

  const handleExpandingNameChange = (uniqueId, expandingName) => {
    const updatedSelectedElements = selectedElements.map((element) =>
      element.uniqueId === uniqueId ? { ...element, expandingName } : element
    );

    setSelectedElements(updatedSelectedElements);
    saveSelectedElementsToLocalStorage(updatedSelectedElements);
  };

  const [newExpandingName, setNewExpandingName] = useState("");
  const handleAddNewExpandingName = async (uniqueId) => {
    if (newExpandingName.trim() !== "") {
      setExpandingNamesList((prevList) => [...prevList, newExpandingName]);
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
          {
            expanding_name: newExpandingName,
          },
          {
            headers: headers,
          }
        );

        console.log("Expanding name added successfully:", response.data);
      } catch (error) {
        console.error("Error adding expanding name:", error);
      }
    }
  };
  return (
    <Box height="650px" overflowY="auto" maxH="50vh" mb="4">
      <Center>
        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
          Element List
        </Text>
      </Center>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th style={{ width: "2%" }}>#</Th>
            <Th style={{ width: "45%" }}>Name</Th>
            <Th style={{ width: "15%" }}>Expanding Field</Th>
            <Th style={{ width: "10%" }}>Time</Th>
            <Th style={{ width: "20%" }}>Selected Options</Th>
            <Th style={{ width: "8%" }}>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {selectedElements.map((element, index) => (
            <Tr key={element.uniqueId}>
              <Td>{index + 1}</Td>
              <Td>{element.name}</Td>
              <Td>{element.expandingName}</Td>
              <Td>{element.time}</Td>
              <Td>
                {/* format the selected options */}
                {element.selectedOptions &&
                  Object.entries(element.selectedOptions).map(
                    ([key, value], idx) => (
                      <Text key={idx} isTruncated maxWidth="100px">
                        {`${key}: ${value}`}
                      </Text>
                    )
                  )}
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteElement(element.uniqueId)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
