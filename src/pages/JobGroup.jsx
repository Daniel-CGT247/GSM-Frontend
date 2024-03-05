import React from "react";
import { Button, Container, Flex, Heading, Box } from "@chakra-ui/react";
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
    <Container maxW="8xl" mt={4}>
      <Flex
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        shadow="md"
        borderRadius="md"
      >
        <Box>
          <Heading size="lg">Job Group</Heading>

          {isStyleLoading ? (
            <StyleSkeleton />
          ) : (
            <Heading size="md" color="gray.500">
              Style {itemName}
            </Heading>
          )}
        </Box>
        <Button
          variant="outline"
          colorScheme="twitter"
          size="sm"
          as="a"
          href={`/`}
          leftIcon={<IoArrowBackCircleOutline />}
        >
          Back to Collection
        </Button>
      </Flex>

      <Flex
        gap={5}
        alignItems="stretch"
        justifyContent="center"
        flexWrap="nowrap"
        marginTop="20px"
      >
        {data.map((job_group) => (
          <JobGroupCard
            key={job_group.id}
            job_group={job_group}
            listId={listId}
            style={{ flex: "0 0 calc(20% - 10px)", marginBottom: "10px" }}
          />
        ))}
      </Flex>
    </Container>
  );
}
