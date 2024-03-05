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
import { useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import OperationLib from "./OperationLib";
import OperationList from "./OperationList";
import { Link as RouterLink } from "react-router-dom";

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
    <Container maxW="7xl" className="p-5">
      <Flex
        direction="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Heading>
          Build Operation {!isJobLoading && <>- {bundleName}</>}
        </Heading>

        {isStyleLoading ? (
          <StyleSkeleton />
        ) : (
          <Heading color="gray.500" size="lg">
            Style {itemName}
          </Heading>
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

      <SimpleGrid columns={2} spacing={5} my={10}>
        <GridItem colSpan={1}>
          <OperationLib
            bundleId={bundleId}
            listId={listId}
            setUpdateFunc={setUpdateOperations}
          />
        </GridItem>
        <GridItem colSpan={1}>
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
