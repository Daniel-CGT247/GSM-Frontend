import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

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
        "https://gsm-app.vercel.app/operation_lib/",
        { params: { bundle_group: bundleGroup } }
      );
      setOperationLibs(response.data);
      localStorage.setItem(`operationLibs_${bundleGroup}`, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddOperation = async (operation) => {
    try {
      const response = await axios.post(
        "https://gsm-app.vercel.app/operation_list/",
        {
          list: listId,
          operations: operation.id,
        },
        { headers }
      );

      const updatedOperations = [
        ...addedOperations,
        operation.id,
      ];
      setAddedOperations(updatedOperations);
      localStorage.setItem(`addedOperations_${listId}`, JSON.stringify(updatedOperations));

      const updatedLibs = operationLibs.map((op) =>
        op.id === operation.id ? { ...op, added: true } : op
      );
      setOperationLibs(updatedLibs);
      localStorage.setItem(`operationLibs_${bundleGroup}`, JSON.stringify(updatedLibs));

      updateOperationLists();
    } catch (error) {
      console.error("Error adding operation:", error);
    }
  };
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
