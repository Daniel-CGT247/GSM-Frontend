import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import endpoint from "../utils/endpoint";

export default function YourListTable({ bundleId, listId }) {
  const [operationList, setOperationList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_list/`, {
          params: {
            bundle_group: bundleId,
            listId: listId,
          },
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        });
        setOperationList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bundleId, listId]);

  return (
    <div className="my-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Operation Code</th>
            <th>Name</th>
            <th>Operated by</th>
            <th>Total SAM</th>
            <th># of Elements</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {operationList.map((item) => (
            <tr key={item.id}>
              <td>{item.operations.operation_code}</td>
              <td>{item.operations.name}</td>
              <td>{item.operations.machine}</td>
              <td>{Number(item.total_sam).toFixed(2)}</td>
              <td>{item.element_count}</td>
              <td>
                <Link
                  to={`/${listId}/operation/${item.operations.id}/${item.id}/element`}
                >
                  <Button variant="btn btn-success">Build Elements</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
