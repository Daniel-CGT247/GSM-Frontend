import {
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

export default function TimeStudy() {
  const { operationListId } = useParams();
  const { data } = useGet(
    `${endpoint}/element_list/?listItem_id=${operationListId}`
  );
  const [selectedElements, setSelectedElements] = useState([]);

  const handleAdd = (newElement) => {
    setSelectedElements((prevElements) => [...prevElements, newElement]);
  };

  const handleDelete = (elementId) => {
    setSelectedElements((prevElements) =>
      prevElements.filter((element) => element.id !== elementId)
    );
  };

  return (
    <Container maxW="8xl">
      <Flex alignItems="center" gap={5}>
        <Heading> Time Study</Heading>
        <Button colorScheme="twitter">Start Timmer</Button>
      </Flex>
      <SimpleGrid columns={2} spacing={4}>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Element</Th>
                <Th>Option</Th>
                <Th>Add</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => {
                return (
                  <Tr key={index}>
                    <Td>{item.elements.name}</Td>
                    <Td>
                      {item.options.map((option) => {
                        return (
                          <div key={option.id}>
                            <h2>{option.name}</h2>
                          </div>
                        );
                      })}
                    </Td>
                    <Td>
                      <Button
                        colorScheme="green"
                        onClick={() => handleAdd(item)}
                      >
                        Add
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table variant="striped" colorScheme="orange">
            <Thead>
              <Tr>
                <Th>Element</Th>
                <Th>Option</Th>
                <Th>Time</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedElements.map((item, index) => {
                return (
                  <Tr key={index}>
                    <Td>{item.elements.name}</Td>
                    <Td>
                      {item.options.map((option) => {
                        return (
                          <div key={option.id}>
                            <h2>{option.name}</h2>
                          </div>
                        );
                      })}
                    </Td>
                    <Td>Timer</Td>
                    <Td>
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </SimpleGrid>
    </Container>
  );
}
