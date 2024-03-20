import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  EditIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
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
  useToast,
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
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
  const [error, setError] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const headers = useHeaders();
  const toast = useToast();

  const paramList = {
    operations__bundle_group_id: bundleId,
    list_id: listId,
  };
  const {
    data: operationList,
    setData: setOperationList,
    isLoading: isOperationListLoading,
  } = useGet(`${endpoint}/operation_list`, paramList, [updateOperationList]);

  // const handleDelete = async (operationListId) => {
  //   try {
  //     await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
  //       headers: headers,
  //     });
  //     setOperationList((operationList) =>
  //       operationList.filter((item) => item.id !== operationListId)
  //     );
  //     setError(false);
  //   } catch (error) {
  //     console.error("Error deleting operation:", error);
  //     setError(true);
  //     setTimeout(() => {
  //       setError(false);
  //     }, 5000);
  //   }
  // };
  const handleDelete = async (operationListId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: headers,
      });
      setOperationList((operationList) =>
        operationList.filter((item) => item.id !== operationListId)
      );
      setError(false);
      toast({
        title: "Operation Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting operation:", error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
      toast({
        title: "Error Deleting Operation",
        description: "Please remove the elements list first",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (operationListId) => {
    try {
      await axios.patch(
        `${endpoint}/operation_list/${operationListId}/`,
        { expanding_name: inputVal },
        { headers: headers }
      );
      toast({
        title: "Operation Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating operation:", error);
      toast({
        title: "Error Updating Operation",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // const handleUpdate = (operationListId) => {
  //   axios.patch(
  //     `${endpoint}/operation_list/${operationListId}/`,
  //     { expanding_name: inputVal },
  //     { headers: headers }
  //   );
  // };

  function EditableControls({ handleUpdate }) {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return (
      isEditing && (
        <ButtonGroup justifyContent="center" size="sm">
          <IconButton
            colorScheme="green"
            aria-label="Save"
            icon={<CheckIcon w="3" />}
            {...getSubmitButtonProps({
              onClick: handleUpdate,
            })}
          />
          <IconButton
            colorScheme="red"
            aria-label="Cancel"
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

    const newTotalPages = Math.ceil(filtered.length / itemsPerPage);

    setCurrentPage(newTotalPages);
  }, [searchTerm, operationList, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOperations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      {isOperationListLoading ? (
        <TableSkeleton header="Operation List" columns={columns} />
      ) : (
        <Card>
          {/* {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Cannot Delete Operation</AlertTitle>
              <AlertDescription>
                Please remove the elements list first
              </AlertDescription>
            </Alert>
          )} */}

          <CardBody>
            <Flex justifyContent="space-between" alignItems="center" mb="4">
              <Text color="gray.700" fontWeight="bold" fontSize="xl">
                Operation List
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1))}
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
                  {currentItems.map((item, index) => (
                    <Tr key={item.id}>
                      <Td>{index + 1 + (currentPage - 1) * itemsPerPage}</Td>
                      <Td>{item.operations.name}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Editable
                            defaultValue={item.expanding_name || "N/A"}
                            onSubmit={(newValue) => {
                              const valueToSend =
                                newValue.trim() === "" ? "N/A" : newValue;
                              handleUpdate(item.id, valueToSend);
                              setInputVal(valueToSend);
                            }}
                            isPreviewFocusable={true}
                          >
                            <EditablePreview
                              _empty={{
                                padding: "8px",
                                display: "inline-block",
                                minWidth: "100px",
                              }}
                            />
                            <EditableInput
                              onChange={(e) => setInputVal(e.target.value)}
                              w="auto"
                              maxWidth="250px"
                            />
                            <EditableControls
                              handleUpdate={() =>
                                handleUpdate(item.id, inputVal)
                              }
                            />
                            <EditIcon ml="2" />
                          </Editable>
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
