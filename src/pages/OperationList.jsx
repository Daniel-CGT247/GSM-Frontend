import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import { FaChevronDown } from "react-icons/fa6";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import headers from "../utils/headers";

const columns = ["#", "Name", "Description", "Job #", "Delete"];

export default function OperationList({
  bundleId,
  listId,
  updateOperationList,
}) {
  const paramList = { bundle_group: bundleId, listId: listId };
  const {
    data: operationList,
    setData: setOperationList,
    isLoading: isOperationListLoading,
  } = useGet(`${endpoint}/operation_list`, paramList, updateOperationList);

  const [selectedDesc, setSelectedDesc] = useState("");

  const [error, setError] = useState(false);

  const handleDelete = async (operationListId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: headers,
      });
      setOperationList((operationList) =>
        operationList.filter((item) => item.id !== operationListId)
      );
      setError(false);
    } catch (error) {
      console.error("Error deleting operation:", error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  return (
    <>
      {isOperationListLoading ? (
        <TableSkeleton header="Operation List" columns={columns} />
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>Operation List</Card.Title>
          </Card.Header>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Cannot Delete Operation</AlertTitle>
              <AlertDescription>
                Please remove the elements list first
              </AlertDescription>
            </Alert>
          )}

          <Card.Body>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Job #</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {operationList.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.operations.name}</Td>
                      <Td>
                        <ExpandingName
                          operationId={item.operations.id}
                          operationListId={item.id}
                          selectedDesc={selectedDesc}
                          setSelectedDesc={setSelectedDesc}
                          item={item}
                        />
                      </Td>
                      <Td>
                        {item.expanding_field &&
                        item.expanding_field.operation_code ? (
                          item.expanding_field.operation_code
                        ) : (
                          <JobCode
                            operationId={item.operations.id}
                            description={selectedDesc}
                          />
                        )}
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export function JobCode({ operationId, description }) {
  const { data: descList } = useGet(
    `${endpoint}/operation_code/?operation=${operationId}`
  );
  const desc = descList && descList.filter((desc) => desc.name === description);
  const jobNumber = desc && desc[0] && desc[0].operation_code;
  return <>{jobNumber}</>;
}

export function ExpandingName({
  operationId,
  operationListId,
  item,
  setSelectedDesc,
}) {
  const { data: descList } = useGet(
    `${endpoint}/operation_code/?operation=${operationId}`
  );

  const handleSelectDesc = (value) => {
    axios
      .patch(
        `${endpoint}/operation_list/${operationListId}`,
        { expanding_field: value.id },
        { headers: headers }
      )
      .then(setSelectedDesc(value.name))
      .catch((error) => console.error("Error updating operation:", error));
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            rightIcon={<FaChevronDown />}
          >
            {item.expanding_field && item.expanding_field.name
              ? item.expanding_field.name
              : "N/A"}
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              type="radio"
              onChange={(value) => {
                handleSelectDesc(value);
              }}
            >
              {descList.map((desc) => (
                <MenuItemOption key={desc.id} value={desc}>
                  {desc.name}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
}
