import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import endpoint from "../utils/endpoint";
import TableSkeleton from "../components/TableSkeleton";

export default function YourListTable({ bundleId, listId }) {
  const [operationList, setOperationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchOperationList = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_list/`, {
          params: {
            // bundle_group: bundleId,
            // listId: listId,
            operations__bundle_group_id: bundleId,
            list__item_id: listId
          },
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        });
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
      setIsLoading(true); 

      try {
        const [operationListData, operationCodesData] = await Promise.all([
          fetchOperationList(),
          fetchOperationCodes(),
        ]);

        const mappedOperationList = operationListData.map((operation) => {
          const operationCodeEntry = operationCodesData.find(
            (code) => code.id === operation.operations.id
          );
  
          let operationCode = "";
          if (operationCodeEntry && operationCodeEntry.name !== "") {
            if (!operation.expanding_field) {
              operationCode = "";
            } else {
              const expandingFieldCodeEntry = operationCodesData.find(
                (code) => code.id === operation.expanding_field.id
              );
              operationCode = expandingFieldCodeEntry
                ? expandingFieldCodeEntry.operation_code
                : "";
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
      } catch (error) {
          console.log(error)
      } finally {
        setIsLoading(false);  
      }
    };

    fetchData();
  }, [bundleId, listId]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        margin: "20px auto",
        maxWidth: "80%",
        textAlign: "center",
      }}
    >
      {isLoading ? (
        <TableSkeleton columns={["OPERATION CODE", "NAME", "EXPANDING FIELD", "TOTAL SAM", "# OF ELEMENTS", "ACTION"]} />
      ) : (
        <Table variant="simple" style={{ margin: "0 auto", width: "100%" }}>
          <Thead>
            <Tr>
              <Th textAlign="center">Operation Code</Th>
              <Th textAlign="center">Name</Th>
              <Th textAlign="center">Expanding Field</Th>
              <Th textAlign="center">Total SAM</Th>
              <Th textAlign="center"># of Elements</Th>
              <Th textAlign="center">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {operationList.map((item) => (
              <Tr key={item.id}>
                <Td textAlign="center">{item.operations.job_code}</Td>
                <Td textAlign="center">{item.operations.name}</Td>
                <Td textAlign="center">{item.expanding_name ? item.expanding_name : ""}</Td>
                <Td textAlign="center">{Number(item.total_sam).toFixed(2)}</Td>
                <Td textAlign="center">{item.element_count}</Td>
                <Td textAlign="center">
                  <Link to={`/${listId}/operation/${item.operations.id}/${item.id}/element`}>
                    <Button colorScheme="green">Build Elements</Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
