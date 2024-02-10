import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import TableSkeleton from "../components/TableSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import headers from "../utils/headers";

const columns = ["#", "Operation Code", "Name", "Delete"];

export default function OperationList({
  bundleId,
  listId,
  updateOperationList,
}) {
  const paramList = { bundle_group: bundleId, listId: listId };
  const {
    data: operationList,
    setData: setOperationList,
    isLoading: isOperationListLoading,
  } = useGet(`${endpoint}/operation_list`, paramList, updateOperationList);

  const [error, setError] = useState(false);

  const handleDelete = async (operationListId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: headers,
      });
      setOperationList((operationList) =>
        operationList.filter((item) => item.id !== operationListId)
      );
      setError(false);
    } catch (error) {
      console.error("Error deleting operation:", error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  return (
    <>
      {isOperationListLoading ? (
        <TableSkeleton header="Operation List" columns={columns} />
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>Operation List</Card.Title>
          </Card.Header>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Cannot Delete Operation</AlertTitle>
              <AlertDescription>
                Please remove the elements list first
              </AlertDescription>
            </Alert>
          )}

          <Card.Body>
            <Table striped hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Operation Code</th>
                  <th>Name</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {operationList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.operations.operation_code}</td>
                    <td>{item.operations.name}</td>
                    <td>
                      <Button
                        className="btn-danger"
                        onClick={() => handleDelete(item.id)}
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
      )}
    </>
  );
}
