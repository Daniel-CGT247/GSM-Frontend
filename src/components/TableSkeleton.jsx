import {
  Card,
  CardBody,
  Skeleton,
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

export default function TableSkeleton({ header, columns }) {
  const rows = [1, 2, 3, 4, 5];
  return (
    <Card>
      <CardBody>
        <TableContainer>
          <Table variant="striped">
            <TableCaption placement="top" bgColor="gray.50">
              <Text color="gray.700" fontWeight="bold" fontSize="lg">
                {header}
              </Text>
            </TableCaption>
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th key={col} scope="col">
                    {col}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row) => (
                <Tr key={row}>
                  {columns.map((col) => (
                    <Td key={col}>
                      <Skeleton mt={4} />
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
