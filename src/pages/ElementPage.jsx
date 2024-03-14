import {
  Box,
  Button,
  Container,
  Flex,
  GridItem,
  HStack,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
    `${currentOperation.bundle_group} - ${currentOperation.name}`;

  const [selectedElements, setSelectedElements] = useState([]);
  const navigate = useNavigate();
  const headers = useHeaders();

  const updateSelectedElements = (newElement) => {
    setSelectedElements((prevElements) => [...prevElements, newElement]);
  };

  const [totalSam, setTotalSam] = useState("Loading...");
  const calculateTotalSam = () => {
    const totalTime = selectedElements.reduce((total, element) => {
      const elementTime = parseFloat(element.time) || 0;
      return total + elementTime;
    }, 0);

    return totalTime.toFixed(2);
  };

  useEffect(() => {
    const finalTotalTime = calculateTotalSam();
    setTotalSam(finalTotalTime);
  }, [selectedElements]);

  ////==============================================
  //// - filter the elements based on the operations
  ////==============================================

  return (
    <Container maxW="8xl" mt={4}>
      <Flex
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        shadow="md"
        borderRadius="md"
        position="sticky"
        top={"50px"}
        zIndex={9}
        bgColor={"white"}
      >
        <Box>
          <Heading size="lg">
            Build Element {!isTitleLoading && <>- {title}</>}
          </Heading>

          {isStyleLoading ? (
            <StyleSkeleton />
          ) : (
            <Heading color="gray.500" size="md">
              Style {itemName}
            </Heading>
          )}
        </Box>

        <HStack alignItems="baseline" justifyContent="space-between" w="150px">
          <Stat
            px="2"
            shadow="sm"
            border="1px solid #e2e8f0"
            borderRadius="md"
            _hover={{ borderColor: "blue", shadow: "lg" }}
            transition={"all 0.3s ease"}
          >
            <Stat textAlign="center">
              <StatLabel fontSize="lg">Total SAM</StatLabel>
              <StatNumber>{totalSam}</StatNumber>
            </Stat>
          </Stat>
        </HStack>

        <Flex alignItems="center" gap={5}>
          <Button
            variant="outline"
            colorScheme="twitter"
            as="a"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<IoArrowBackCircleOutline />}
          >
            Operation List
          </Button>
          <Button
            as="a"
            size="sm"
            colorScheme="twitter"
            rightIcon={<IoCheckmarkCircleOutline />}
            onClick={() => navigate(-1)}
          >
            Complete
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} my={5}>
        <GridItem colSpan={1}>
          <ElementLib
            selectedElements={selectedElements}
            updateSelectedElements={updateSelectedElements}
          />
        </GridItem>
        <GridItem colSpan={1} key={selectedElements.length}>
          <ElementList
            selectedElements={selectedElements}
            updateSelectedElements={updateSelectedElements}
          />
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
