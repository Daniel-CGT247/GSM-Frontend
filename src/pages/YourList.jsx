import { Button, Container, Flex, Heading } from "@chakra-ui/react";
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
    `${endpoint}/job_group/${jobId}`
  );
  const bundle_group =
    jobGroup &&
    jobGroup.bundle_groups &&
    jobGroup.bundle_groups.find((bundle) => bundle.id == bundleId);
  const bundleName = bundle_group && bundle_group.name;


  return (
    <Container maxW="7xl" className="p-5">
      <Flex
        direction="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Heading>Your List {!isJobLoading && <>- {bundleName}</>}</Heading>
        {isStyleLoading ? (
          <StyleSkeleton />
        ) : (
          <Heading size="lg">Style {itemName}</Heading>
        )}
        <Button
          as="a"
          href={`/${listId}/job_group/${jobId}/${bundleId}/operation`}
          variant="outline"
          colorScheme="twitter"
          leftIcon={<IoArrowBackCircleOutline />}
          mb={5}
        >
          Edit Operation List
        </Button>
      </Flex>
      <YourListTable bundleId={bundleId} listId={listId} />
    </Container>
  );
}
