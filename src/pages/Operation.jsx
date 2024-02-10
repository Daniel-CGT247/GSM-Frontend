import React, { useState } from "react";
import {
  Button,
  Flex,
  Container,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import OperationLib from "./OperationLib";
import OperationList from "./OperationList";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import JobDrawer from "../components/JobDrawer";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const { data: styleNum, isLoading: isStyleLoading } = useGet(
    `${endpoint}/collection/${listId}`
  );
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const { data: jobGroup, isLoading: isJobLoading } = useGet(
    `${endpoint}/job_group/${jobId}`
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
      <div className="flex flex-col space-y-2 items-center justify-center">
        <Heading>
          Build Operation {!isJobLoading && <>- {bundleName}</>}
        </Heading>

        {isStyleLoading ? (
          <StyleSkeleton />
        ) : (
          <Heading size="lg">Style {itemName}</Heading>
        )}
        <Flex alignItems="center" gap={5} my={5}>
          <Button onClick={onOpen}>
            <Flex alignItems="center" gap={1}>
              <IoArrowBackCircleOutline />
              Choose another jobs
            </Flex>
          </Button>
          <Link to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}>
            <Button colorScheme="blue">
              <Flex alignItems="center" gap={1}>
                Complete <IoCheckmarkCircleOutline />
              </Flex>
            </Button>
          </Link>
        </Flex>
      </div>
      <div className="container text-center my-5">
        <div className="row">
          <div className="col">
            <OperationLib
              bundleId={bundleId}
              listId={listId}
              setUpdateFunc={setUpdateOperations}
            />
          </div>
          <div className="col space-y-10">
            <OperationList
              bundleId={bundleId}
              listId={listId}
              updateOperationList={updateOperations}
            />
          </div>
        </div>
      </div>
      <JobDrawer
        onClose={onClose}
        isOpen={isOpen}
        styleNum={itemName}
        listId={listId}
      />
    </Container>
  );
}
