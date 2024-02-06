import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import headers from "../utils/headers";
import endpoint from "../utils/endpoint";

export default function OperationLib({ operationLibs, onAdd, listId }) {
  const handleAddOperation = async (operation) => {
    try {
      await axios.post(
        `${endpoint}/operation_list/`,
        {
          list: listId,
          operations: operation.id,
        },
        { headers: headers }
      );
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
              <th scope="col">Name</th>
              <th scope="col">Add</th>
            </tr>
          </thead>
          <tbody>
            {operationLibs &&
              operationLibs.map((operation) => (
                <tr key={operation.id}>
                  <td>{operation.name}</td>
                  <td>
                    <Button
                      className="btn-success"
                      onClick={() => {
                        onAdd(operation.id);
                        handleAddOperation(operation);
                      }}
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
