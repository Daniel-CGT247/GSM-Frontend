import { Button, Container, Flex, Heading } from "@chakra-ui/react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import YourListTable from "./YourListTable";

export default function YourList() {
  const { listId, jobId, bundleId } = useParams();

  const { data: styleNum, isLoading: isStyleLoading } = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum?.item?.name;
  
  const { data: jobGroup, isLoading: isJobLoading } = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group = jobGroup?.bundle_groups?.find(bundle => bundle.id === Number(bundleId));
  const bundleName = bundle_group && bundle_group.name;


  return (
    <Container maxW="container.xl" p={5}>
      <Flex direction="column" align="center" justify="center" textAlign="center" mb={10}>
        {isJobLoading || isStyleLoading ? (
          <StyleSkeleton height="20px" width="200px" mb={4} />
        ) : (
          <>
            <Heading as="h1" size="xl" mb={2} color="gray.800">
              Your List - {bundleName}
            </Heading>
            <Heading as="h3" size="lg" mb={6} color="gray.500">
              Style {itemName}
            </Heading>
          </>
        )}

        <Link to={`/${listId}/job_group/${jobId}/${bundleId}/operation`}>
          <Button leftIcon={<IoArrowBackCircleOutline />} colorScheme="blue" variant="solid">
            Edit Operation List
          </Button>
        </Link>
      </Flex>
      <YourListTable bundleId={bundleId} listId={listId} />
    </Container>
  );
}
