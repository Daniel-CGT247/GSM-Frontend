import {
  Button,
  Card,
  CardBody,
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
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import headers from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

const columns = ["Name", ""];

export default function OperationLib({ bundleId, listId, setUpdateFunc }) {
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
          </CardBody>
        </Card>
      )}
    </>
  );
}
