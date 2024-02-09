import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import endpoint from "../utils/endpoint";

export default function YourListTable({ bundleId, listId }) {
  const [operationList, setOperationList] = useState([]);

  const tableStyle = {
    maxWidth: '80%',
    margin: '0 auto',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/operation_list/`, 
          {
            params: {
              bundle_group: bundleId,
              listId: listId,
            },
            headers: {
              Authorization: `JWT ${localStorage.getItem('access_token')}`,
            },
          }
        );

        const operations = response.data
        
        const operationCodesResponse = await axios.get(
          `${endpoint}/operation_code/`, 
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem('access_token')}`,
            },
          }
        );

        const operationCodes = operationCodesResponse.data

        const operationsWithCodes = operations.map((operation) => {
          const operationCodeInfo = operationCodes.find(
            (code) => code.id === (operation.expanding_field ? operation.expanding_field.id : operation.operations.id)
          );
          return {
            ...operation,
            operation_code: operationCodeInfo ? operationCodeInfo.operation_code : '',
          };
        });

        setOperationList(operationsWithCodes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [bundleId, listId]);

  return (
    <div className="my-5" style={{ display: 'flex', justifyContent: 'center' }}>
      <Table striped bordered hover style={{ ...tableStyle, textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Operation Code</th>
            <th>Operation</th>
            <th>Concat Name</th>
            <th>Total SAM</th>
            <th># of Elements</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {operationList.map((item) => (
            <tr key={item.id}>
              <td>{item.operation_code}</td>
              <td>{item.operations.name}</td>
              <td>{item.expanding_field ? item.expanding_field.name : item.operations.name}</td>
              <td>{Number(item.total_sam).toFixed(2)}</td>
              <td>{item.element_count}</td>
              <td>
                  <Link
                    to={`/${listId}/operation/${item.operations.id}/${item.id}/element`}
                  >
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
