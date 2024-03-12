import {
  Card,
  CardBody,
  Flex,
  Skeleton,
  Table,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";

export default function TableSkeleton({ header, columns }) {
  const rows = [1, 2, 3];
  return (
    <Card>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Text color="gray.700" fontWeight="bold" fontSize="xl">
            {header}
          </Text>
          <Skeleton width="150px" height="25px" />
        </Flex>
        <Skeleton width={"100%"} height="30px" my={4} />

        <Table variant={"striped"}>
          <Thead>
            <Tr>
              {columns.map((col) => (
                <Th key={col} scope="col">
                  {col}
                </Th>
              ))}
            </Tr>
          </Thead>
        </Table>
        {rows.map((row) => (
          <Skeleton key={row} height="50px" my={4} />
        ))}
      </CardBody>
    </Card>
  );
}
