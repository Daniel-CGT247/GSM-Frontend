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
} from "@chakra-ui/react";
import { HiPuzzle } from "react-icons/hi";
import { LuFlower } from "react-icons/lu";

export default function CollectionCard({ list, maxWidth }) {
  const placeholderImage = "https://placehold.co/200x170";
  const imageUrl = list.item.image || placeholderImage;

  return (
    <>
      <Card maxW={maxWidth} overflow="hidden" variant="outline">
        <HStack>
          <Image key={list.id} src={imageUrl} maxW="200px" objectFit="cover" />

          <CardBody>
            <Heading size="md">{list.item.name}</Heading>
            <Text>{list.complete ? "Completed" : "In-Progress"}</Text>

            <Flex gap={4} mb={4}>
              <Flex alignItems="center" gap={1}>
                <LuFlower />
                {list.item.season}
              </Flex>
              <Flex alignItems="center" gap={1}>
                <HiPuzzle />
                {list.item.proto}
              </Flex>
            </Flex>
            <Button
              colorScheme="twitter"
              variant="solid"
              as="a"
              href={`${list.id}/job_group`}
            >
              Continue
            </Button>
          </CardBody>
        </HStack>
        <Flex
          bgColor="gray.100"
          height="50px"
          justifyContent="center"
          alignItems="center"
        >
          <Text my={0}>Last Update: {list.last_update}</Text>
        </Flex>
      </Card>
    </>
  );
}
