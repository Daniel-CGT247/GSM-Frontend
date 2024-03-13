import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Search2Icon,
  CloseIcon
} from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Center,
  InputRightElement,
  Box
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";
const columns = ["Name", ""];

export default function OperationLib({ bundleId, listId, setUpdateFunc }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLibs, setFilteredLibs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLibs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLibs.length / itemsPerPage);
  const headers = useHeaders();

  const paramLib = { bundle_group_id: bundleId };
  const paramList = {
    operations__bundle_group_id: bundleId,
    list_id: listId,
  };

  const { data: operations, isLoading: isLibLoading } = useGet(
    `${endpoint}/operation_lib`,
    paramLib,
    [bundleId]
  );

  const { data: operationList } = useGet(
    `${endpoint}/operation_list`,
    paramList,
    [listId]
  );

  const addOperation = (operation) => {
    const body = { list: listId, operations: operation.id };
    axios
      .post(`${endpoint}/operation_list/`, body, { headers: headers })
      .then(() => {
        setUpdateFunc([
          ...operationList,
          {
            list: listId,
            operations: { id: operation.id, name: operation.name },
          },
        ]);
      })
      .catch((error) => console.error("Error adding operation:", error));
  };

  useEffect(() => {
    const filtered = operations.filter((operation) => {
      return (
        operation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (operation.code &&
          operation.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredLibs(filtered);
  }, [operations, searchTerm]);

  return (
    <>
      {isLibLoading ? (
        <TableSkeleton header="Operation Library" columns={columns} />
      ) : (
      <Card>
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb="4">
            <Center flexGrow={1}>
              <Text color="gray.700" fontWeight="bold" fontSize="lg">
                Operation Library
              </Text>
            </Center>
            <Flex alignItems="center">
              <IconButton
                icon={<ChevronLeftIcon />}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
                mr="2"
              />
              <Text>{currentPage}</Text>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                isDisabled={currentPage >= totalPages}
                ml="2"
              />
            </Flex>
          </Flex>
          <InputGroup mb="4">
            <InputLeftElement pointerEvents="none">
              <Search2Icon />
            </InputLeftElement>
            <Input
              placeholder="Search by name"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
           {searchTerm && (
              <InputRightElement>
                <Box as="button" onClick={() => setSearchTerm('')}>
                  <CloseIcon boxSize="3" /> 
                </Box>
              </InputRightElement>
            )}
          </InputGroup>

          <TableContainer>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th textAlign="center">Name</Th>
                  <Th textAlign="center">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((operation) => (
                  <Tr key={operation.id}>
                    <Td textAlign="center">{operation.name}</Td>
                    <Td textAlign="center">
                      <Flex justifyContent="center">
                        <Button colorScheme="green" onClick={() => addOperation(operation)}>
                          Add
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      )}
    </>
  );
}
