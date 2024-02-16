import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Flex, Heading, SimpleGrid, GridItem } from "@chakra-ui/react";
import { IoArrowBackCircleOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import useGet from "../customed_hook/getData";
import OperationLibList from "./OperationLib";
import OperationList from "./OperationList";
import endpoint from "../utils/endpoint";
import StyleSkeleton from "../components/StyleSkeleton";
import { Link as RouterLink } from "react-router-dom";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group = jobGroup?.bundle_groups?.find(bundle => bundle.id.toString() === bundleId);
  const bundleName = bundle_group?.name ?? 'Loading...';

  const [operationList, setOperationList] = useState([]);

  const updateOperationLists = (newOperation) => {
    setOperationList((prevOperationList) => {
      const tempOperation = {
        ...newOperation,
        id: newOperation.id || `temp-${Date.now()}`,
      };
      return [...prevOperationList, tempOperation];
    });
  };

  return (
    <Container maxW="7xl" p={5}>
      <Flex direction="column" gap={2} alignItems="center" justifyContent="center">
        <Heading>Build Operation - {bundleName}</Heading>
        {styleNum ? (
          <Heading as="h3" size="lg" mb={6} color="gray.500">
            Style {itemName}
          </Heading>
        ) : (
          <StyleSkeleton />
        )}
        <Flex alignItems="center" gap={5}>
          <Button
            as={RouterLink}
            to={`/${listId}/job_group`}
            variant="outline"
            leftIcon={<IoArrowBackCircleOutline />}
          >
            Back to Job Group
          </Button>
          <Button
            as={RouterLink}
            to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}
            colorScheme="blue"
            rightIcon={<IoCheckmarkCircleOutline />}
          >
            Complete
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 5 }} spacing={5} my={10} templateColumns="1fr 1fr">
        <GridItem colSpan={1}>
          <OperationLibList
            bundleGroup={bundleId}
            listId={listId}
            updateOperationLists={updateOperationLists}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <OperationList
            key={operationList.length}
            bundleGroup={bundleId}
            listId={listId}
            operationListProp={operationList}
            bundleName={bundleName}
          />
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
