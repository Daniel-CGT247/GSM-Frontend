import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Card,
  CardBody,
  TableCaption,
  Text,
} from "@chakra-ui/react";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

const columns = [
  "Name",
  "Description",
  "Job #",
  "Total SAM",
  "# of Elements",
  "",
];
export default function YourListTable({ bundleId, listId }) {
  const params = {
    bundle_group: bundleId,
    listId: listId,
  };

  const { data: operationList, isLoading } = useGet(
    `${endpoint}/operation_list/`,
    params
  );
  return (
    <>
      {isLoading ? (
        <TableSkeleton header="Your List" columns={columns} />
      ) : (
        <Card>
          <CardBody>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <TableCaption placement="top" bgColor="gray.50">
                  <Text as="h4">Your List</Text>
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Job #</Th>
                    <Th isNumeric>Total SAM</Th>
                    <Th isNumeric># of Elements</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {operationList.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.operations.name}</Td>
                      <Td>
                        {item.expanding_field && item.expanding_field.name}
                      </Td>
                      <Td>
                        {item.expanding_field &&
                          item.expanding_field.operation_code}
                      </Td>
                      <Td isNumeric>{Number(item.total_sam).toFixed(2)}</Td>
                      <Td isNumeric>{item.element_count}</Td>
                      <Td>
                        <Button
                          as="a"
                          href={`/${listId}/operation/${item.operations.id}/${item.id}/element`}
                          colorScheme="twitter"
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
