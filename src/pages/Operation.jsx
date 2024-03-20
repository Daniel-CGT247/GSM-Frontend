import {
  Box,
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
import { Link as RouterLink, useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import OperationLib from "./OperationLib";
import OperationList from "./OperationList";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const { data: styleNum, isLoading: isStyleLoading } = useGet(
    `${endpoint}/collection/${listId}`
  );
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const { data: jobGroup, isLoading: isJobLoading } = useGet(
    `${endpoint}/job_group/${jobId}`,
    null,
    [jobId]
  );

  const bundle_group =
    jobGroup &&
    jobGroup.bundle_groups &&
    jobGroup.bundle_groups.find((bundle) => bundle.id.toString() === bundleId);
  const bundleName = bundle_group && bundle_group.name;

  const [updateOperations, setUpdateOperations] = useState([]);

  return (
    <Container maxW="8xl" mt={4}>
      <Flex
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        shadow="md"
        borderRadius="md"
      >
        <Box position="sticky" top="50px" zIndex={10}>
          <Heading size="lg">
            Build Operation {!isJobLoading && <>- {bundleName}</>}
          </Heading>

          {isStyleLoading ? (
            <StyleSkeleton />
          ) : (
            <Heading color="gray.500" size="md">
              Style {itemName}
            </Heading>
          )}
        </Box>
        <Flex alignItems="center" gap={2}>
          <Button
            as={RouterLink}
            to={`/${listId}/job_group`}
            variant="outline"
            colorScheme="twitter"
            leftIcon={<IoArrowBackCircleOutline />}
            size="sm"
          >
            Job Group
          </Button>
          <Button
            as={RouterLink}
            size="sm"
            to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}
            colorScheme="twitter"
            rightIcon={<IoCheckmarkCircleOutline />}
          >
            Complete
          </Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={3} spacing={5} mt={5}>
        <GridItem colSpan={1}>
          <OperationLib
            bundleId={bundleId}
            listId={listId}
            setUpdateFunc={setUpdateOperations}
          />
        </GridItem>
        <GridItem colSpan={2}>
          <OperationList
            bundleId={bundleId}
            listId={listId}
            updateOperationList={updateOperations}
          />
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}
