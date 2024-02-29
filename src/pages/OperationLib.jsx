import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import headers from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

const columns = ["Name", ""];

export default function OperationLib({ bundleId, listId, setUpdateFunc }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLibs, setFilteredLibs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const paramLib = { bundle_group_id: bundleId };
  const paramList = {
    operations__bundle_group_id: bundleId,
    list__item_id: listId,
  };

  const { data: operations, isLoading: isLibLoading } = useGet(
    `${endpoint}/operation_lib`,
    paramLib,
    [bundleId]
  );

  // const [operations, setOperations] = useState([]);
  // useEffect(() => {
  //   axios.get(`${endpoint}/operation_lib`, { params: paramLib }).then((res) => {
  //     setOperations(res.data);
  //   });
  // }, [bundleId]);

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
    <>
      {isLibLoading ? (
        <TableSkeleton header="Operation Library" columns={columns} />
      ) : (
        <Card>
          <CardBody>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <TableCaption placement="top" bgColor="gray.50">
                  <Text as="h4">Operation Library</Text>
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {operations.map((operation) => (
                    <Tr key={operation.id}>
                      <Td>{operation.name}</Td>
                      <Td>
                        <Button
                          colorScheme="green"
                          onClick={() => addOperation(operation)}
                        >
                          Add
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex mt="4" justifyContent="center" alignItems="center">
              <IconButton
                icon={<ChevronLeftIcon />}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
                mr="4"
              />
              <HStack spacing="20px">{renderPaginationNumbers()}</HStack>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                isDisabled={currentPage >= totalPages}
                ml="4"
              />
            </Flex>
          </CardBody>
        </Card>
      )}
    </>
  );
}
