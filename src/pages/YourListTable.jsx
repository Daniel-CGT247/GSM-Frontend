import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TableSkeleton from "../components/TableSkeleton";

const columns = [
  "Name",
  "Description",
  "Job #",
  "Total SAM",
  "# of Elements",
  "",
];
export default function YourListTable({ operationList, listId, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOperations, setFilteredOperations] = useState([]);

  useEffect(() => {
    const filtered = operationList.filter(
      (operation) =>
        operation.operations.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (operation.operations.job_code &&
          operation.operations.job_code
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
    setFilteredOperations(filtered);
  }, [searchTerm, operationList]);

  return (
    <>  
      {isLoading ? (
        <TableSkeleton header="Your List" columns={columns} />
      ) : (
        <Card>
          <CardBody>
            <Center flexGrow={1}>
              <Text fontSize="xl" color="gray.700" fontWeight="bold" mb="4">
                Your List
              </Text>
            </Center>
            <InputGroup mb="4">
              <InputLeftElement pointerEvents="none">
                <Search2Icon />
              </InputLeftElement>
              <Input
                placeholder="Search by name or job ID"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                mb="4"
              />
              {searchTerm && (
                <InputRightElement>
                  <Box as="button" onClick={() => setSearchTerm("")}>
                    <CloseIcon boxSize="3" />
                  </Box>
                </InputRightElement>
              )}
            </InputGroup>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Job #</Th>
                    <Th isNumeric>SAM</Th>
                    <Th isNumeric># of Elements</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOperations.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.operations.name}</Td>
                      <Td>{item.expanding_name}</Td>
                      <Td>{item.operations.job_code}</Td>
                      <Td isNumeric>{Number(item.total_sam).toFixed(2)}</Td>
                      <Td isNumeric>{item.element_count}</Td>
                      <Td>
                        <Button
                          as="a"
                          href={`/${listId}/operation/${item.operations.id}/${item.id}/element`}
                          colorScheme="twitter"
                          size="sm"
                        >
                          Build Elements
                        </Button>
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
