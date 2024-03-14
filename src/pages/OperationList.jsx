import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  EditIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  IconButton,
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
  useEditableControls,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOperations, setFilteredOperations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOperations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);

  const paramList = {
    operations__bundle_group_id: bundleId,
    list_id: listId,
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
            <Flex justifyContent="space-between" alignItems="center" mb="4">
              <Text color="gray.700" fontWeight="bold" fontSize="xl">
                Operation Library
              </Text>

              <Flex justifyContent="space-between" alignItems="center" gap={2}>
                <Text color="gray">
                  Page <span style={{ fontWeight: "bold" }}>{currentPage}</span>{" "}
                  of {totalPages}
                </Text>

                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  isDisabled={currentPage === 1}
                  size="sm"
                />
                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          gap={2}
                        >
                          <Text color="gray">
                            Page{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {currentPage}
                            </span>{" "}
                            of {totalPages}
                          </Text>

                          <IconButton
                            icon={<ChevronLeftIcon />}
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            isDisabled={currentPage === 1}
                            size="sm"
                          />
                          <IconButton
                            icon={<ChevronRightIcon />}
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            isDisabled={currentPage >= totalPages}
                            size="sm"
                          />
                        </Flex>
                      )
                    )
                  }
                  isDisabled={currentPage >= totalPages}
                  size="sm"
                />
              </Flex>
            </Flex>
            <InputGroup mb="4">
              <InputLeftElement pointerEvents="none">
                <Search2Icon />
              </InputLeftElement>
              <Input
                placeholder="Search by name or job ID"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
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
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOperations.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.operations.name}</Td>
                      <Td>
                        <HStack>
                          <Editable
                            defaultValue={
                              item.expanding_name ? item.expanding_name : "N/A"
                            }
                            onChange={(value) => setInputVal(value)}
                            onSubmit={() => handleUpdate(item.id)}
                          >
                            <EditablePreview />
                            <Input as={EditableInput} />
                            <EditableControls
                              handleUpdate={() => handleUpdate(item.id)}
                            />
                          </Editable>
                          <EditIcon />
                        </HStack>
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
