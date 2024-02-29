import {
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  IoArrowBackCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useParams } from "react-router-dom";
import JobDrawer from "../components/JobDrawer";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            variant="outline"
            colorScheme="twitter"
            as="a"
            href={`/${listId}/job_group/`}
            leftIcon={<IoArrowBackCircleOutline />}
          >
            Choose another jobs
          </Button>
          <Button
            as="a"
            href={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}
            colorScheme="twitter"
            rightIcon={<IoCheckmarkCircleOutline />}
          >
            Complete
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid columns={3} spacing={5} my={10}>
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
