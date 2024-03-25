import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import {
  IoArrowBackCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import ElementLib from "./ElementLib";
import ElementList from "./ElementList";

export default function ElementPage() {
  const [open, setOpen] = useState(true);
  const { listId, operationId, operationListId } = useParams();
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

  const updateSelectedElements = (newElement) => {
    setSelectedElements((prevElements) => [...prevElements, newElement]);
  };

  const [totalTime, setTotalTime] = useState(0);

  // Function to update total time
  const handleTotalTimeUpdate = (time) => {
    setTotalTime(time);
  };

  //==============================================
  // - filter the elements based on the operations
  //==============================================

  return (
    <Container maxW="85%" mt={4}>
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
              {/* <StatNumber isNumeric>{Number(timeData).toFixed(2)}</StatNumber> */}
              <StatNumber>{totalTime.toFixed(2)}</StatNumber>
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
          <Button
            as="a"
            leftIcon={<FaChevronCircleRight />}
            href={`/${operationListId}/timestudy`}
          >
            Time Study
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid
        position={"relative"}
        columns={open ? 2 : 1}
        spacing={5}
        my={5}
      >
        {open && (
          <ElementLib
            selectedElements={selectedElements}
            updateSelectedElements={updateSelectedElements}
          />
        )}
        <ElementList
          selectedElements={selectedElements}
          updateSelectedElements={updateSelectedElements}
          onTotalTimeUpdate={handleTotalTimeUpdate}
        />
        <Icon
          as={open ? FaChevronCircleLeft : FaChevronCircleRight}
          position="absolute"
          boxSize={6}
          top="4%"
          left="-1.2%"
          zIndex={10}
          color="blue.400"
          onClick={() => {
            setOpen(!open);
          }}
          cursor="pointer"
        >
          Button
        </Icon>
      </SimpleGrid>
    </Container>
  );
}
