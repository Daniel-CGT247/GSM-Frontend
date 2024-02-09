import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  List,
  ListIcon,
  ListItem,
  Text,
  Link,
} from "@chakra-ui/react";
import { CiCircleRemove } from "react-icons/ci";
import { FaCircleNotch } from "react-icons/fa";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
export default function JobDrawer({ onClose, isOpen, styleNum, listId }) {
  const { isLoading, data } = useGet(`${endpoint}/job_group/`, {
    listId: listId,
  });
  console.log(data);

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
                <AccordionItem key={job_group}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Text>{job_group.name}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <List spacing={3}>
                      {job_group.bundle_groups.map((bundle_group) => (
                        <ListItem key={bundle_group}>
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
