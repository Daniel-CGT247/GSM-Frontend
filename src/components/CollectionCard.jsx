import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import { HiPuzzle } from "react-icons/hi";
import { LuFlower } from "react-icons/lu";
import { TbCircleFilled } from "react-icons/tb";
import { RxLapTimer } from "react-icons/rx";

export default function CollectionCard({ list, maxWidth }) {
  const placeholderImage = "https://placehold.co/200x170";
  const imageUrl = list.item.image || placeholderImage;
  console.log(list.item.image);

  return (
    <>
      <Card
        maxW={maxWidth}
        overflow="hidden"
        variant="outline"
        _hover={{ shadow: "md", borderColor: "twitter.500" }}
        transition="all 0.3s ease"
      >
        <HStack>
          <Image
            key={list.id}
            src={imageUrl}
            objectFit="cover"
            maxW="500px"
            maxH="300px"
            flexShrink={0}
            boxSize="200px"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
          <CardBody>
            <HStack>
              <Heading size="md">{list.item.name}</Heading>
              <Icon
                as={TbCircleFilled}
                color={list.complete ? "green" : "orange"}
                boxSize={3}
              />
            </HStack>
            <HStack my={2} gap={2}>
              <HStack gap={1}>
                <LuFlower color="gray" />
                <Text color="gray">{list.item.season}</Text>
              </HStack>
              <HStack gap={1}>
                <HiPuzzle color="gray" />
                <Text color="gray">{list.item.proto}</Text>
              </HStack>
            </HStack>
            <HStack gap={1} my={2}>
              <RxLapTimer />
              <Text fontWeight="semibold">23.4</Text>
            </HStack>
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
