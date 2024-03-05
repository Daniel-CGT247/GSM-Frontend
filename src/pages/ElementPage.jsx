import {
  Button,
  Container,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  IoArrowBackCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";
import ElementLib from "./ElementLib";
import ElementList from "./ElementList";

export default function ElementPage() {
  const { listId, operationId } = useParams();
  const { data: styleNum, isLoading: isStyleLoading } = useGet(
    `${endpoint}/collection/${listId}`
  );
  const itemName = styleNum && styleNum.item && styleNum.item.name;
  const { data: currentOperation, isLoading: isTitleLoading } = useGet(
    `${endpoint}/operation_lib/${operationId}`
  );
  const title =
    currentOperation &&
    "Build Element" +
      ` - ${currentOperation.bundle_group} - ${currentOperation.name}`;

  const [selectedElements, setSelectedElements] = useState([]);
  const navigate = useNavigate();
  const headers = useHeaders();
  const updateSelectedElements = (newElement) => {
    setSelectedElements((prevSelectedElements) => [
      ...prevSelectedElements,
      newElement,
    ]);
  };

  ////==============================================
  //// - filter the elements based on the operations
  ////==============================================

  return (
    <Container maxW="7xl" p={4}>
      <Flex
        direction="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        {isTitleLoading ? (
          <Heading>Build Element</Heading>
        ) : (
          <Heading>{title}</Heading>
        )}
        {isStyleLoading ? (
          <StyleSkeleton />
        ) : (
          <Heading color="gray.500" size="lg">
            Style {itemName}
          </Heading>
        )}
        <Flex alignItems="center" gap={5}>
          <Button
            variant="outline"
            colorScheme="twitter"
            as="a"
            onClick={() => navigate(-1)}
            leftIcon={<IoArrowBackCircleOutline />}
          >
            Choose Another Operation
          </Button>
          <Button
            as="a"
            colorScheme="twitter"
            rightIcon={<IoCheckmarkCircleOutline />}
            onClick={() => navigate(-1)}
          >
            Complete
          </Button>
        </Flex>
      </Flex>
      {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} my={10}> */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} my={5}>
        <GridItem colSpan={1}>
          <ElementLib />
        </GridItem>
        <GridItem colSpan={1}>
          <ElementList />
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
