import React from "react";
import Card from "react-bootstrap/Card";
import NewItemForm from "../components/NewItemForm";
import newItemHeaderImage from "../images/new-item-header.jpg"; 

export default function NewItem() {
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
          <NewItemForm />
        </Card.Body>
      </Card>
    </div>
  );
}

