
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Flex, Heading, SimpleGrid, GridItem, } from "@chakra-ui/react";
import { IoArrowBackCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import useGet from "../customed_hook/getData"; 
import ElementLib from "./ElementLib";
import ElementList from "./ElementList";
import endpoint from "../utils/endpoint";
import StyleSkeleton from "../components/StyleSkeleton";

export default function ElementPage() {
  const { listId, operationId } = useParams();
  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;
  const [selectedElements, setSelectedElements] = useState([]);
  const navigate = useNavigate();
  
  const updateSelectedElements = (newElement) => {
    setSelectedElements((prevSelectedElements) => [...prevSelectedElements, newElement]);
  };

////==============================================
//// - filter the elements based on the operations 
////==============================================
  const [currentOperation, setCurrentOperation] = useState(null);
  useEffect(() => {
    axios
      .get(`${endpoint}/operation_lib/${operationId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setCurrentOperation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching operation details:", error);
      });
  }, [operationId]);


  return (
    <Container maxW="8xl" p={4}>
      <Flex direction="column" gap={2} alignItems="center" justifyContent="center">
        <Heading>Build Elements - {currentOperation?.bundle_group} - {currentOperation?.name} </Heading>
        {styleNum ? (
          <Heading as="h3" size="lg" mb={6} color="gray.500">
            Style {itemName}
          </Heading>
        ) : (
          <StyleSkeleton />
        )}
        <Flex alignItems="center" gap={5}>
          <Button
            onClick={() => navigate(-1)} 
            variant="outline"
            leftIcon={<IoArrowBackCircleOutline />}
          >
            Back
          </Button>
          <Button
            onClick={() => navigate(-1)}
            colorScheme="blue"
            rightIcon={<IoCheckmarkCircleOutline />}
          >
            Complete
          </Button>
        </Flex>
      </Flex>
      {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} my={10}> */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} my={5}>
        <GridItem colSpan={1}>
          <ElementLib
            listId={listId}
            updateSelectedElements={updateSelectedElements}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <ElementList
            key={selectedElements.length}
            listId={listId}
            selectedElements={selectedElements}
          />
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}