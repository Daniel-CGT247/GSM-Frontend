import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  HStack,
} from "@chakra-ui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import YourListTable from "./YourListTable";

export default function YourList() {
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

  return (
    <Container maxW="8xl" mt={4}>
      <Flex
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        shadow="md"
        borderRadius="md"
        mb={5}
      >
        <Box bgColor="white" position="sticky" top={"50px"} zIndex={9}>
          <Heading size="lg">
            Your List {!isJobLoading && <>- {bundleName}</>}
          </Heading>
          {isStyleLoading ? (
            <StyleSkeleton />
          ) : (
            <Heading color="gray.500" size="md">
              Style {itemName}
            </Heading>
          )}
        </Box>
        <HStack alignItems="baseline" justifyContent="space-between" w="400px">
          <Stat
            px="2"
            shadow="sm"
            border="1px solid #e2e8f0"
            borderRadius="md"
            _hover={{ borderColor: "blue", shadow: "lg" }}
            transition={"all 0.3s ease"}
          >
            <StatLabel fontSize="lg">Total SAM</StatLabel>
            <StatNumber>34.24</StatNumber>
          </Stat>

          <Stat
            px="2"
            shadow="sm"
            border="1px solid #e2e8f0"
            borderRadius="md"
            _hover={{ borderColor: "blue", shadow: "lg" }}
            transition={"all 0.3s ease"}
          >
            <StatLabel fontSize="lg">Count</StatLabel>
            <StatNumber>3</StatNumber>
          </Stat>
        </HStack>
        <Button
          as="a"
          href={`/${listId}/job_group/${jobId}/${bundleId}/operation`}
          variant="outline"
          size="sm"
          colorScheme="twitter"
          leftIcon={<IoArrowBackCircleOutline />}
        >
          Edit Operation List
        </Button>
      </Flex>
      <YourListTable bundleId={bundleId} listId={listId} />
    </Container>
  );
}
