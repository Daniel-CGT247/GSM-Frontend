import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import headers from "../utils/headers";

const columns = ["Name", "Add"];

export default function OperationLib({ bundleId, listId, setUpdateFunc }) {
  const paramLib = { bundle_group: bundleId };
  const paramList = { bundle_group: bundleId, listId: listId };

  const { data: operations, isLoading: isLibLoading } = useGet(
    `${endpoint}/operation_lib`,
    paramLib
  );

  const { data: operationList } = useGet(
    `${endpoint}/operation_list`,
    paramList
  );

  const addOperation = (operation) => {
    const body = { list: listId, operations: operation.id };

    axios
      .post(`${endpoint}/operation_list/`, body, { headers: headers })
      .then(() => {
        setUpdateFunc([
          ...operationList,
          {
            list: listId,
            operations: { id: operation.id, name: operation.name },
          },
        ]);
      })
      .catch((error) => console.error("Error adding operation:", error));
  };

  return (
    <>
      {isLibLoading ? (
        <TableSkeleton header="Operation Library" columns={columns} />
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>Operation Library</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table striped hover>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Add</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((operation) => (
                  <tr key={operation.id}>
                    <td>{operation.name}</td>
                    <td>
                      <Button
                        className="btn-success"
                        onClick={() => addOperation(operation)}
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
      )}
    </>
  );
}
