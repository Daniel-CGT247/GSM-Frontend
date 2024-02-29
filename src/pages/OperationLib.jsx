import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Card,
  CardBody,
  Input,
  Box,
  Center,
  Flex,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import endpoint from "../utils/endpoint";
import TableSkeleton from "../components/TableSkeleton";

export default function OperationLib({ bundleGroup, listId, updateOperationLists }) {
  const [loading, setLoading] = useState(true);
  const [operationLibs, setOperationLibs] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLibs, setFilteredLibs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [libsResponse] = await Promise.all([
          axios.get(
            `${endpoint}/operation_lib/`,
            { 
              params: { bundle_group_id: bundleGroup, }, 
              headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
            }
          ),
        ]);

        setOperationLibs(libsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching operation libraries:", error);
        setOperationLibs([]); // Set to an empty array on error to stop loading state
        setLoading(false);
      }
    };

    fetchData();
  }, [bundleGroup, listId, updateOperationLists]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = operationLibs?.filter(item => {
      return (
        item.name.toLowerCase().includes(lowercasedFilter) || 
        item.job_code.toString().includes(lowercasedFilter)
      );
    });
    setFilteredLibs(filteredData || []);
    setCurrentPage(1); // Reset to the first page on filter change
  }, [operationLibs, searchTerm]);

  const handleAddOperation = async (operation) => {
    try {
      const response = await axios.post(
        `${endpoint}/operation_list/`, 
        { 
          operations: operation.id, 
          list: listId 
        }, 
        { 
          headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` } 
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Operation added successfully:", response.data);
        updateOperationLists(response.data); 
      } else {
        console.error("Failed to add operation:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding operation:", error.response ? error.response.data : error);
    }
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLibs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLibs.length / itemsPerPage);

  const renderPaginationNumbers = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Button
          key={number}
          colorScheme={currentPage === number ? "blue" : "gray"}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Button>
      );
    }
    return items;
  };

  return (
    <Card>
      <CardBody>
        <Box p={5}>
          <Center>
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">Operation Library</Text>
          </Center>
          <Input
            placeholder="Search by name or code"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            mb="4"
          />
        </Box>

        <TableContainer height="300px" overflowY="auto">
          {loading ? (
            <TableSkeleton columns={["Name", "Code", "Add"]} />
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Code</Th>
                  <Th>Add</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((operation) => (
                  <Tr key={operation.id}>
                    <Td>{operation.name}</Td>
                    <Td>{operation.job_code}</Td>
                    <Td>
                      <Button
                        colorScheme="green"
                        onClick={() => handleAddOperation(operation)}
                      >
                        Add
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>

        <Flex mt="4" justifyContent="center" alignItems="center">
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
            mr="4"
          />
          <HStack spacing="20px">
            {renderPaginationNumbers()}
          </HStack>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage >= totalPages}
            ml="4"
          />
        </Flex>
      </CardBody>
    </Card>
  );
}
