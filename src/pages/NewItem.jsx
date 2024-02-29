import React from "react";
import Card from "react-bootstrap/Card";
import NewItemForm from "../components/NewItemForm";
import newItemHeaderImage from "../images/new-item-header.jpg";
import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";

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
  console.log(username);
  return (
    <div className="flex p-3 justify-center items-center min-h-screen">
      <Card style={{ width: "30rem" }}>
        <Card.Img variant="top" src={newItemHeaderImage} />
        <Card.Body>
          <Card.Title>New Item Information</Card.Title>
          <Card.Text className="text-slate-400">
            Start building your own style
          </Card.Text>
        </Card.Body>
        <Card.Body>
          <NewItemForm username={username} />
        </Card.Body>
      </Card>
    </div>
  );
}
