import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import headers from "../utils/headers";
import endpoint from "../utils/endpoint";

export default function OperationList({ operationList, onDelete }) {
  const handleDelete = async (operationListId) => {
    const response = await axios
      .delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: headers,
      })
      .then((response) => {
        console.log("Data deleted:", response);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Operation List</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Expanding Name</th>
              <th>Operation Code</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {operationList &&
              operationList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.operations.name}</td>
                  <td></td>
                  <td></td>
                  <td>
                    <Button
                      className="btn-danger"
                      onClick={() => {
                        onDelete(item.id);
                        handleDelete(item.id);
                      }}
                    >
                      Delete
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
