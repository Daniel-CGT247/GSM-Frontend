import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  useDisclosure,
  Badge
} from "@chakra-ui/react";
import { HiPuzzle } from "react-icons/hi";
import { LuFlower } from "react-icons/lu";
import JobDrawer from "./JobDrawer";
import { Link } from "react-router-dom";

export default function CollectionCard({ list, maxWidth }) {
  const { isOpen, onClose } = useDisclosure();
  const placeholderImage = "https://placehold.co/200x170";
  const imageUrl = list.item.image || placeholderImage;

  return (
    <>
      <Card maxW={maxWidth || "full"} w="full" overflow="hidden" variant="outline">
        <HStack w="full" spacing={4}>
          <Image key={list.id} src={imageUrl} maxW="500px" maxH="300px" objectFit="cover" flexShrink={0} />

          <CardBody flex={1}>
            <Heading size="md">{list.item.name}</Heading>
            <Badge colorScheme={list.complete ? "green" : "orange"} mb={4}>
              {list.complete ? "Completed" : "In-Progress"}
            </Badge>

            <Flex direction="column" gap={4} mb={4}>
              <Flex alignItems="center" gap={2}>
                <LuFlower />
                {list.item.season}
              </Flex>
              <Flex alignItems="center" gap={2}>
                <HiPuzzle />
                {list.item.proto}
              </Flex>
            </Flex>
            <Link to={`/${list.id}/job_group`}>
              <Button w="full" mt={2} variant="solid" colorScheme="twitter"> 
                Continue
              </Button>
            </Link>
          </CardBody>
        </HStack>
        <Flex
          bgColor="gray.100"
          h="50px"
          justifyContent="center"
          alignItems="center"
        >
          <Text my={0}>Last Update: {list.last_update}</Text>
        </Flex>
      </Card>
      <JobDrawer onClose={onClose} isOpen={isOpen} styleNum={list.item.name} listId={list.id}/>
    </>
  );
}
