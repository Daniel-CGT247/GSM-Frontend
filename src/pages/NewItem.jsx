import React from "react";
import NewItemForm from "../components/NewItemForm";
import newItemHeaderImage from "../images/new-item-header.jpg";
import { useState } from "react";
import { useEffect } from "react";
import {
  Container,
  Card,
  Image,
  Heading,
  Text,
  CardBody,
} from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";

export default function NewItem() {
  const { instance } = useMsal();
  const [username, setName] = useState(null);

  const activeAccount = instance.getActiveAccount();
  useEffect(() => {
    if (activeAccount) {
      setName(activeAccount.username);
    } else {
      setName(null);
    }
  }, [activeAccount]);
  return (
    <Container size="7xl" p={5}>
      <Card style={{ width: "30rem" }}>
        <Image src={newItemHeaderImage} />
        <CardBody>
          <Heading fontSize="2xl">New Item Information</Heading>
          <Text color="gray.500">Start building your own style</Text>
        </CardBody>
        <CardBody>
          <NewItemForm username={username} />
        </CardBody>
      </Card>
    </Container>
  );
}
