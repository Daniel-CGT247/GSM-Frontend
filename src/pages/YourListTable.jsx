import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import endpoint from "../utils/endpoint";

export default function YourListTable({ bundleId, listId }) {
  const [operationList, setOperationList] = useState([]);

  useEffect(() => {
    const fetchOperationList = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/operation_list/`,
          {
            params: { 
              bundle_group: bundleId, 
              listId: listId 
            },
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching operation list:", error);
        return [];
      }
    };

    const fetchOperationCodes = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_code/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching operation codes:", error);
        return [];
      }
    };

    const fetchData = async () => {
      const [operationListData, operationCodesData] = await Promise.all([
        fetchOperationList(),
        fetchOperationCodes(),
      ]);

      const mappedOperationList = operationListData.map((operation) => {
        const operationCodeEntry = operationCodesData.find(code => code.id === operation.operations.id);

        let operationCode = '';
        if (operationCodeEntry && operationCodeEntry.name !== "") {
          if (!operation.expanding_field) {
            operationCode = '';
          } else {
            const expandingFieldCodeEntry = operationCodesData.find(code => code.id === operation.expanding_field.id);
            operationCode = expandingFieldCodeEntry ? expandingFieldCodeEntry.operation_code : '';
          }
        } else if (operationCodeEntry) {
          operationCode = operationCodeEntry.operation_code;
        }

        return {
          ...operation,
          operationCode: operationCode,
        };
      });

      setOperationList(mappedOperationList);
    };

    fetchData();
  }, [bundleId, listId]);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      margin: '20px auto',
      maxWidth: '80%',
      textAlign: 'center'
    }}>
      <Table bordered style={{ margin: '0 auto', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Operation Code</th>
            <th>Name</th>
            <th>Expanding Field</th>
            <th>Total SAM</th>
            <th># of Elements</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {operationList.map((item) => (
            <tr key={item.id}>
              <td>{item.operations.job_code}</td>
              <td>{item.operations.name}</td>
              <td>{item.expanding_name ? item.expanding_name : ''}</td>
              <td>{Number(item.total_sam).toFixed(2)}</td>
              <td>{item.element_count}</td>
              <td>
                <Link to={`/${listId}/operation/${item.operations.id}/${item.id}/element`}>
                  <Button variant="success">Build Elements</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}