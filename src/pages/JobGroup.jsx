import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import JobGroupCard from "../components/JobGroupCard";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

export default function JobGroup() {
  const { listId } = useParams();
  const { data } = useGet(`${endpoint}/job_group`);
  const { data: styleNum, isLoading: isStyleLoading } = useGet(
    `${endpoint}/collection/${listId}`
  );
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  return (
    <Container maxW="7xl" p={10}>
      <Flex
        direction="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Heading>Job Group</Heading>
        {isStyleLoading ? (
          <StyleSkeleton />
        ) : (
          <Heading size="lg" color="gray.500">
            Style {itemName}
          </Heading>
        )}

        <Button
          variant="outline"
          colorScheme="twitter"
          as="a"
          href={`/`}
          leftIcon={<IoArrowBackCircleOutline />}
        >
          Back to Collection
        </Button>
      </Flex>
      <Flex gap={5} alignItems="center" justifyContent="center" flexWrap="wrap">
        {data.map((job_group) => (
          <JobGroupCard job_group={job_group} listId={listId} />
        ))}
      </Flex>
    </Container>
  );
}
