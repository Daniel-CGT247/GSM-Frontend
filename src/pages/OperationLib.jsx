import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import endpoint from "../utils/endpoint";

export default function OperationLibList({ 
  bundleGroup, 
  listId, 
  updateOperationLists 
}) {
  const [operationLibs, setOperationLibs] = useState([]);
  const headers = { 
    Authorization: `JWT ${localStorage.getItem("access_token")}` 
  };

  useEffect(() => {
    const storedOperationLibs = localStorage.getItem(`operationLibs_${bundleGroup}`);
    if (storedOperationLibs) {
      setOperationLibs(JSON.parse(storedOperationLibs));
    } else {
      fetchData(); 
    }
  }, [bundleGroup]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${endpoint}/operation_lib/`, 
        { 
          params: { bundle_group: bundleGroup },
          headers,
      });
      setOperationLibs(response.data);
      localStorage.setItem(`operationLibs_${bundleGroup}`, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddOperation = async (operation) => {
    const updatedOperationLibs = operationLibs.map(op =>
      op.id === operation.id ? { ...op, added: true } : op
    );
  
    // update localStorage 
    setOperationLibs(updatedOperationLibs);
    localStorage.setItem(`operationLibs_${bundleGroup}`, JSON.stringify(updatedOperationLibs));
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/operation_list/",
        {
          list: listId,
          operations: operation.id,
        },
        { headers }
      );
  
      updateOperationLists(); 
    } catch (error) {
      console.error("Error adding operation:", error);
    }
  };
  
  return (
    <Card>
      <Card.Header><Card.Title>Operation Library</Card.Title></Card.Header>
      <Card.Body>
        <Table striped hover>
          <thead>
            <tr>
              <th scope="col">Operation Code</th>
              <th scope="col">Name</th>
              <th scope="col">Add</th>
            </tr>
          </thead>
          <tbody>
            {operationLibs.map((operation) => (
              <tr key={operation.id}>
                <td>{operation.operation_code}</td>
                <td>{operation.name}</td>
                <td>
                  <Button className="btn-success" onClick={() => handleAddOperation(operation)}>
                    Add
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
