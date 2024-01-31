import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LuFlower } from "react-icons/lu"; 
import { Link } from "react-router-dom";
import { HiPuzzle } from 'react-icons/hi'; 


export default function CollectionCard({ list }) {
  const placeholderImage = "https://placehold.co/200x170";

  // image url from api
  const imageUrl = list.item.image || placeholderImage;

  return (
    <Card style={{ width: "90%" }}>
      <div className="grid grid-cols-10">
        
        <Card.Img
          className="col-span-5"
          key={list.id}
          variant="top"
          src={imageUrl} 
          style={{ 
            width: '200px', 
            height: '190px', 
            objectFit: 'contain' }}
        />

        <Card.Body className="flex flex-col col-span-7">
          <Card.Title>{list.item.name}</Card.Title>
          <Card.Text>{list.complete ? "Completed" : "In-Progress"}</Card.Text>
          
          <div className="flex gap-3 items-center">
            
            <div className="flex gap-1 items-center">
              <LuFlower />
              <Card.Text>{list.item.season}</Card.Text>
            </div>
           
            <div className="flex gap-1 items-center">
              <HiPuzzle />
              <Card.Text>{list.item.proto}</Card.Text>
            </div>
          
          </div>

          <Link to={`/${list.id}/job_group`}>
            <Button className="w-1/2 mt-2" variant="primary">
              Continue
            </Button>
          </Link>

        </Card.Body>
        
        <Card.Footer className="text-muted text-center col-span-12">
          Last Update: {list.last_update}
        </Card.Footer>

      </div>
    </Card>
  );
}
