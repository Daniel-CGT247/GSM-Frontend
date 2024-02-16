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
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import endpoint from "../utils/endpoint";

export default function OperationList({ bundleGroup, listId, operationListProp }) {
  const [operationList, setOperationList] = useState([]);
  const [operationCodes, setOperationCodes] = useState({});
  const [selectedCodes, setSelectedCodes] = useState({});
  const [operations, setOperations] = useState(operationListProp);
  const [deleteError, setDeleteError] = useState(null);
  const [expandingFields, setExpandingFields] = useState({});
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setOperations(operationListProp);
  }, [operationListProp]);

  const fetchOperations = async () => {
    try {
      const operationsResponse = await axios.get(`${endpoint}/operation_list/`, {
        params: { bundle_group: bundleGroup, listId: listId },
        headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
      });
      setOperationList(operationsResponse.data);
  
      const newExpandingFields = {};
      const newOperationCodes = {};
  
      operationsResponse.data.forEach(operation => {

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
    fetchOperations();
  }, [bundleGroup, listId]);

  const fetchOperationCodes = async (operationId) => {
    try {
      const response = await axios.get(`${endpoint}/operation_code/?operation=${operationId}`, {
        headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
      });
      const codes = response.data;
      setOperationCodes(prev => ({ ...prev, [operationId]: codes }));
      const autoSelectedCode = codes.find(code => code.name === "");
      if (autoSelectedCode) {
        setSelectedCodes(prev => ({ ...prev, [operationId]: autoSelectedCode }));
      }
    } catch (error) {
      console.error(`Error fetching operation codes for operation ${operationId}:`, error);
    }
  };

  const handleDelete = async (operationListId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      setOperationList(prevOperationList => prevOperationList.filter(item => item.id !== operationListId));
      setDeleteError(null);
      console.log("Operation deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDeleteError(error.response.data.error || 'An error occurred while deleting the operation.');
      } else {
        setDeleteError('Please delete the related elements before deleting this operation.');
      }
    }
  };

  const postData = async (operationId, expandingName) => {
    try {
      const response = await axios.patch(`${endpoint}/operation_list/${operationId}`, {
        expanding_name: expandingName
      }, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("Expanding field updated successfully:", response.data);
      fetchOperations(); 
      setSaved(true);
    } catch (error) {
      console.error("Error updating expanding field:", error);
    }
  };


  const handleExpandingFieldChange = (operationId, e) => {
    const target = e.target;
    target.style.height = 'inherit';  
    target.style.height = `${target.scrollHeight}px`;  
    
    setExpandingFields(prev => ({ ...prev, [operationId]: target.value }));
    setSaved(false);
  };
  

  const handleSave = (operationId) => {
    const expandingName = expandingFields[operationId];
    postData(operationId, expandingName); 
  };

  return (
    <Box as={Card}>
      <Box as={CardBody}>
        <Center>
          <Text fontSize="2xl" fontWeight="bold" color="gray.700">Operation List</Text>
        </Center>
        {deleteError && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}
      <Table variant="simple" size="md" style={{ tableLayout: 'fixed' }}>
      <Thead>
        <Tr>
          <Th width="5px">#</Th>
          <Th flex={2} minWidth="200px" maxWidth="300px">Name</Th>
          <Th width="83px">Code</Th>
          <Th flex={2} minWidth="200px" width="150px">Expanding Field</Th> 
          <Th width="80px">Add</Th>
          <Th width="95px">Delete</Th>
        </Tr>
      </Thead>

        <Tbody>
          {operationList.map((operation, index) => (
            <Tr key={operation.id}>
              <Td>{index + 1}</Td>
              <Td>{operation.operations.name || 'N/A'}</Td>
              <Td>{operation.operations.job_code}</Td>
              <Td>
                <Textarea
                  value={expandingFields[operation.id] || ''}
                  onChange={(e) => handleExpandingFieldChange(operation.id, e)}
                  resize="none"
                  width="100%" 
                />
              </Td>

              <Td>
                <Button colorScheme="blue" onClick={() => handleSave(operation.id)}>Save</Button>
              </Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(operation.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
        {saved && (
          <Alert status="success">
            <AlertIcon />
            Changes saved successfully
          </Alert>
        )}
      </Box>
    </Box>
  );
}
