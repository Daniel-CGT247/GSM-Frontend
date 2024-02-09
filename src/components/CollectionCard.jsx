import {
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  Divider,
  Flex,
  Box,
} from "@chakra-ui/react";
import { HiPuzzle } from "react-icons/hi";
import { LuFlower } from "react-icons/lu";

export default function CollectionCard({ list }) {
  const placeholderImage = "https://placehold.co/200x170";

  // image url from api
  const imageUrl = list.item.image || placeholderImage;

  return (
    <Card maxW="lg" overflow="hidden" variant="outline">
      <HStack>
        <Image key={list.id} src={imageUrl} maxW="200px" objectFit="cover" />

        <CardBody>
          <Heading size="lg">{list.item.name}</Heading>
          <Text>{list.complete ? "Completed" : "In-Progress"}</Text>

          <Flex gap={4} mb={4}>
            <Flex alignItems="center">
              <LuFlower />
              {list.item.season}
            </Flex>
            <Flex alignItems="center">
              <HiPuzzle />
              {list.item.proto}
            </Flex>
          </Flex>
          <Link href={`/${list.id}/job_group`}>
            <Button colorScheme="blue" variant="solid">
              Continue
            </Button>
          </Link>
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
  );
}
