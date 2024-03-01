import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useEditableControls,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";
const columns = ["#", "Name", "Description", "Job #", ""];

export default function OperationList({
  bundleId,
  listId,
  updateOperationList,
}) {
  const paramList = {
    operations__bundle_group_id: bundleId,
    list__item_id: listId,
  };
  const {
    data: operationList,
    setData: setOperationList,
    isLoading: isOperationListLoading,
  } = useGet(`${endpoint}/operation_list`, paramList, [updateOperationList]);

  const headers = useHeaders();

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

  const [inputVal, setInputVal] = useState("");

  const handleUpdate = (operationListId) => {
    axios.patch(
      `${endpoint}/operation_list/${operationListId}/`,
      { expanding_name: inputVal },
      { headers: headers }
    );
  };

  function EditableControls({ handleUpdate }) {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return (
      isEditing && (
        <ButtonGroup ml="2" size="sm">
          <IconButton
            colorScheme="green"
            icon={<CheckIcon w="3" />}
            {...getSubmitButtonProps({
              onClick: handleUpdate,
            })}
          />
          <IconButton
            colorScheme="red"
            icon={<CloseIcon w="3" />}
            {...getCancelButtonProps()}
          />
        </ButtonGroup>
      )
    );
  }

  return (
    <>
      {isOperationListLoading ? (
        <TableSkeleton header="Operation List" columns={columns} />
      ) : (
        <Card>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Cannot Delete Operation</AlertTitle>
              <AlertDescription>
                Please remove the elements list first
              </AlertDescription>
            </Alert>
          )}

          <CardBody>
            <TableContainer>
              <Table variant="striped" colorScheme="gray">
                <TableCaption placement="top" bgColor="gray.50">
                  <Text color="gray.700" fontWeight="bold" fontSize="lg">
                    Operation List
                  </Text>
                </TableCaption>

                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Job #</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {operationList.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.operations.name}</Td>
                      <Td>
                        <Editable
                          defaultValue={
                            item.expanding_name ? item.expanding_name : "N/A"
                          }
                          onChange={(value) => {
                            setInputVal(value);
                          }}
                          onSubmit={() => {
                            handleUpdate(item.id);
                          }}
                        >
                          <EditablePreview />
                          <Input as={EditableInput} />
                          <EditableControls
                            handleUpdate={() => handleUpdate(item.id)}
                          />
                        </Editable>
                      </Td>
                      <Td>{item.operations.job_code}</Td>
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
          </CardBody>
        </Card>
      )}
    </>
  );
}
