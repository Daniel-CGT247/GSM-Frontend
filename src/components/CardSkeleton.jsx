import {
  Card,
  CardBody,
  CardFooter,
  Flex,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

export default function CardSkeleton() {
  const cards = [1, 2];
  return (
    <>
      {cards.map((card) => (
        <Card key={card} maxW="lg">
          <CardBody>
            <Flex gap={10} mb="2">
              <Skeleton w="200px" h="170px" />
              <SkeletonText noOfLines={4} width="70%" spacing="5" />
            </Flex>
          </CardBody>
          <CardFooter>
            <Skeleton width="100%" height="25px" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
