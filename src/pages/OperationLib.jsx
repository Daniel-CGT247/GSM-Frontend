import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import endpoint from "../utils/endpoint";

export default function OperationLibList({
  bundleGroup,
  listId,
  updateOperationLists,
}) {
  const [operationLibs, setOperationLibs] = useState([]);
  const [addedOperations, setAddedOperations] = useState([]);
  const headers = {
    Authorization: `JWT ${localStorage.getItem("access_token")}`,
  };

  const handleAddOperation = async (operation) => {
    try {
      await axios.post(
        `${endpoint}/operation_list/`,
        {
          list: listId,
          operations: operation.id,
        },
        { headers }
      );

      setAddedOperations((prevAddedOperations) => [
        ...prevAddedOperations,
        operation.id,
      ]);

      setOperationLibs((prevOperationLibs) =>
        prevOperationLibs.map((op) =>
          op.id === operation.id ? { ...op, added: true } : op
        )
      );
      updateOperationLists();
    } catch (error) {
      console.error("Error adding operation:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/operation_lib/`,
          {
            params: { bundle_group: bundleGroup },
          }
        );
        setOperationLibs(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bundleGroup, listId, updateOperationLists]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Operation Library</Card.Title>
      </Card.Header>
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
            {operationLibs &&
              operationLibs.map((operation) => (
                <tr key={operation.id}>
                  <td>{operation.operation_code}</td>
                  <td>{operation.name}</td>
                  <td>
                    <Button
                      className="btn-success"
                      onClick={() => handleAddOperation(operation)}
                    >
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
