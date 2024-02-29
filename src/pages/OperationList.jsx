import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  Center,
} from "@chakra-ui/react";
import TableSkeleton from "../components/TableSkeleton";
import endpoint from "../utils/endpoint";

export default function OperationList({
  bundleGroup,
  listId,
  operationListProp,
}) {
  const [operationList, setOperationList] = useState([]);
  const [operationCodes, setOperationCodes] = useState({});
  const [selectedCodes, setSelectedCodes] = useState({});
  const [operations, setOperations] = useState(operationListProp);
  const [deleteError, setDeleteError] = useState(null);
  const [expandingFields, setExpandingFields] = useState({});
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Replace the deleteError and saved states with statusMessage and messageContent
  const [statusMessage, setStatusMessage] = useState(null); // "error", "success", or null
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    setOperations(operationListProp);
  }, [operationListProp]);

  const fetchOperations = async () => {
    try {
      const operationsResponse = await axios.get(
        `${endpoint}/operation_list/`,
        {
          params: {
            operations__bundle_group_id: bundleGroup,
            list__item_id: listId,
          },
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        },
      );
      setOperationList(operationsResponse.data);

      const newExpandingFields = {};
      const newOperationCodes = {};

      operationsResponse.data.forEach((operation) => {
        fetchOperationCodes(operation.operations.id);

        if (operation.expanding_name !== null) {
          newExpandingFields[operation.id] = operation.expanding_name;
        }
      });

      setExpandingFields(newExpandingFields);
      setOperationCodes(newOperationCodes);
    } catch (error) {
      console.error("Error fetching operations:", error);
    }
  };

  useEffect(() => {
    fetchOperations()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [bundleGroup, listId]);

  const fetchOperationCodes = async (operationId) => {
    try {
      const response = await axios.get(
        `${endpoint}/?operation=${operationId}&list__item_id=${listId}&operations__bundle_group_id=${bundleGroup}`,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const codes = response.data;
      if (Array.isArray(codes)) {
        setOperationCodes((prev) => ({ ...prev, [operationId]: codes }));
        const autoSelectedCode = codes.find((code) => code.name === "");
        if (autoSelectedCode) {
          setSelectedCodes((prev) => ({
            ...prev,
            [operationId]: autoSelectedCode,
          }));
        }
      } else {
        console.error(
          `Expected an array for operation codes, received:`,
          codes,
        );
      }
    } catch (error) {
      console.error(
        `Error fetching operation codes for operation ${operationId}:`,
        error,
      );
    }
  };

  const handleDelete = async (operationListId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      setOperationList((prevOperationList) =>
        prevOperationList.filter((item) => item.id !== operationListId),
      );
      setStatusMessage("success");
      setMessageContent("Operation deleted successfully");
    } catch (error) {
      let errorMessage =
        "Please delete the related elements before deleting this operation.";
      if (error.response && error.response.status === 400) {
        errorMessage =
          error.response.data.error ||
          "An error occurred while deleting the operation.";
      }
      setStatusMessage("error");
      setMessageContent(errorMessage);
    }
  };

  const postData = async (operationId, expandingName) => {
    try {
      const response = await axios.patch(
        `${endpoint}/operation_list/${operationId}/`,
        { expanding_name: expandingName },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        },
      );
      console.log("Expanding field updated successfully:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error updating expanding field:", error);
      throw error;  
    }
  };

  const handleExpandingFieldChange = (operationId, e) => {
    const target = e.target;
    target.style.height = "inherit";
    target.style.height = `${target.scrollHeight}px`;

    setExpandingFields((prev) => ({ ...prev, [operationId]: target.value }));
    setSaved(false);
  };

  const handleSave = (operationId) => {
    const expandingName = expandingFields[operationId];
    postData(operationId, expandingName)
      .then(() => {
        setOperationList((prevOperationList) =>
          prevOperationList.map((operation) =>
            operation.id === operationId
              ? { ...operation, expanding_name: expandingName }
              : operation,
          ),
        );
        setStatusMessage("success");
        setMessageContent("Changes saved successfully");
      })
      .catch((error) => {
        console.error("Failed to save expanding name:", error);
        setStatusMessage("error");
        setMessageContent("An error occurred while saving changes.");
      });
  };

  return (
    <Box as={Card}>
      <Box as={CardBody}>
        <Center>
          <Text fontSize="2xl" fontWeight="bold" color="gray.700">
            Operation List
          </Text>
        </Center>

        {deleteError && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <TableSkeleton
            columns={["#", "Name", "Code", "Expanding Field", "Add", "Delete"]}
          />
        ) : operationList.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" size="md" style={{ tableLayout: "auto" }}>
              <Thead>
                <Tr>
                  <Th px={2} flex={2} minWidth="50px">
                    #
                  </Th>
                  <Th px={2} flex={2} minWidth="80px">
                    Name
                  </Th>
                  <Th px={2}>Code</Th>
                  <Th px={2} flex={2} minWidth="160px">
                    Expanding Field
                  </Th>
                  <Th px={2}>Add</Th>
                  <Th px={2}>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {operationList.map((operation, index) => (
                  <Tr key={operation.id}>
                    <Td px={2}>{index + 1}</Td>
                    <Td px={2}>{operation.operations.name || "N/A"}</Td>
                    <Td px={2}>{operation.operations.job_code}</Td>
                    <Td px={2}>
                      <Textarea
                        value={expandingFields[operation.id] || ""}
                        onChange={(e) =>
                          handleExpandingFieldChange(operation.id, e)
                        }
                        resize="none"
                        width="100%"
                      />
                    </Td>
                    <Td px={2}>
                      <Button
                        colorScheme="blue"
                        onClick={() => handleSave(operation.id)}
                      >
                        Save
                      </Button>
                    </Td>
                    <Td px={2}>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(operation.id)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text fontSize="md" color="gray.500" mt={4}>
            No items in the operation list.
          </Text>
        )}

        {statusMessage && (
          <Alert status={statusMessage}>
            <AlertIcon />
            {statusMessage === "error" ? (
              <AlertTitle mr={2}>Error!</AlertTitle>
            ) : null}
            <AlertDescription>{messageContent}</AlertDescription>
          </Alert>
        )}
      </Box>
    </Box>
  );
}
