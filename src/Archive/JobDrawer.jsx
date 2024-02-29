import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { CiCircleRemove } from "react-icons/ci";
import { FaCircleNotch } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

export default function JobDrawer({ onClose, isOpen, styleNum, listId }) {
  const { isLoading, data } = useGet(`${endpoint}/job_group/`, {
    listId: listId,
  });

  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          Job Group - {styleNum}
        </DrawerHeader>
        <DrawerBody>
          {data ? (
            <Accordion allowToggle>
              {data.map((job_group) => (
                <AccordionItem key={job_group.id}>
<<<<<<< HEAD
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <Text>{job_group.name}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
=======
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Text>{job_group.name}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
>>>>>>> 489c1825972cb4eb7103617892929271d3877fe0
                  <AccordionPanel pb={4}>
                    <List spacing={3}>
                      {job_group.bundle_groups.map((bundle_group) => (
                        <ListItem key={bundle_group.id}>
                          {bundle_group.operations_count === 0 ? (
                            <ListIcon as={CiCircleRemove} color="red.500" />
                          ) : (
                            <ListIcon as={FaCircleNotch} color="blue.500" />
                          )}
                          <Link
                            href={`/${listId}/job_group/${job_group.id}/${bundle_group.id}/operation`}
                          >
                            {bundle_group.name}
                          </Link>
                          <Checkbox
                            isDisabled={bundle_group.operations_count === 0}
                            colorScheme="whatsapp"
                            mx={5}
                          ></Checkbox>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Text>Loading...</Text>
          )}
<<<<<<< HEAD
          {window.location.pathname !== "/" && (
            <Link href={`/`}>
=======
          {window.location.pathname !== "/collection" && (
            <Link href={`/collection`}>
>>>>>>> 489c1825972cb4eb7103617892929271d3877fe0
              <Flex alignItems="center" gap={1} my={5}>
                <IoIosArrowBack />
                Back to Collection
              </Flex>
            </Link>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
