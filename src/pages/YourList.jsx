import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
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

  const params = {
    operations__bundle_group_id: bundleId,
    list_id: listId,
  };

  const { data: operationList, isLoading: isListLoading } = useGet(
    `${endpoint}/operation_list/`,
    params
  );

  const totalSAM = operationList.reduce(
    (acc, curr) => acc + Number(curr.total_sam),
    0
  );

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
        position="sticky"
        top="50px"
        zIndex={10}
        bgColor="white"
      >
        <Box>
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
        {!isListLoading && (
          <HStack
            alignItems="baseline"
            justifyContent="space-between"
            w="150px"
          >
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
                <StatNumber>{totalSAM.toFixed(2)}</StatNumber>
              </Stat>
            </Stat>
          </HStack>
        )}

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
      <YourListTable
        operationList={operationList}
        isLoading={isListLoading}
        listId={listId}
      />
    </Container>
  );
}
