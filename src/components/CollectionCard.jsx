import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { HiPuzzle } from "react-icons/hi";
import { LuFlower } from "react-icons/lu";
import { TbCircleFilled } from "react-icons/tb";
import { RxLapTimer } from "react-icons/rx";
import { FaPen } from "react-icons/fa";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

export default function CollectionCard({ list, maxWidth, updateItemInData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const headers = useHeaders();
  const placeholderImage = "https://placehold.co/200x170";
  const imageUrl = list.item.image || placeholderImage;

  const [newName, setNewName] = useState(list.item.name);
  const [newSeason, setNewSeason] = useState(list.item.season);
  const [newProto, setNewProto] = useState(list.item.proto);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${endpoint}/collection/${list.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          item: {
            name: newName,
            season: newSeason,
            proto: newProto,
          },
        }),
      });
      if (response.ok) {
        const updatedItem = await response.json(); 
        updateItemInData(updatedItem); 
 
        toast({
          title: "Update successful.",
          description: "Item's details updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        //window.location.reload();  
      } else {
        throw new Error("Failed to update item details");
      }
      
    } catch (error) {
      toast({
        title: "Error updating item.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Card
        position="relative"
        maxW={maxWidth}
        overflow="hidden"
        variant="outline"
        _hover={{ shadow: "md", borderColor: "twitter.500" }}
        transition="all 0.3s ease"
      >
        <IconButton
          icon={<FaPen />}
          isRound
          size="sm"
          position="absolute"
          right={2}
          top={2}
          onClick={onOpen}
          aria-label="Edit item"
        />
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
            <HStack justifyContent="space-between" width="30%">
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

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Flex direction="column" gap="4">
                <FormControl>
                  <FormLabel>Style Name</FormLabel>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter Your Style..."
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Season</FormLabel>
                  <Input
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    placeholder="Example: SP/FW2024"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Prototype</FormLabel>
                  <Input
                    value={newProto}
                    onChange={(e) => setNewProto(e.target.value)}
                    placeholder="Enter A Number..."
                  />
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
