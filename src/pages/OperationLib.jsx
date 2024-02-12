// import {
//   Button,
//   Table,
//   TableCaption,
//   TableContainer,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   Card,
//   CardBody,
// } from "@chakra-ui/react";
// import axios from "axios";
// import TableSkeleton from "../components/TableSkeleton";
// import useGet from "../customed_hook/useGet";
// import endpoint from "../utils/endpoint";
// import headers from "../utils/headers";

// const columns = ["Name", ""];

// export default function OperationLib({ bundleId, listId, setUpdateFunc }) {
//   const paramLib = { bundle_group: bundleId };
//   const paramList = { bundle_group: bundleId, listId: listId };

//   const { data: operations, isLoading: isLibLoading } = useGet(
//     `${endpoint}/operation_lib`,
//     paramLib
//   );

//   const { data: operationList } = useGet(
//     `${endpoint}/operation_list`,
//     paramList
//   );

//   const addOperation = (operation) => {
//     const body = { list: listId, operations: operation.id };

//     axios
//       .post(`${endpoint}/operation_list/`, body, { headers: headers })
//       .then(() => {
//         setUpdateFunc([
//           ...operationList,
//           {
//             list: listId,
//             operations: { id: operation.id, name: operation.name },
//           },
//         ]);
//       })
//       .catch((error) => console.error("Error adding operation:", error));
//   };

//   return (
//     <>
//       {isLibLoading ? (
//         <TableSkeleton header="Operation Library" columns={columns} />
//       ) : (
//         <Card>
//           <CardBody>
//             <TableContainer>
//               <Table variant="striped" colorScheme="gray">
//                 <TableCaption placement="top" bgColor="gray.50">
//                   <Text as="h4">Operation Library</Text>
//                 </TableCaption>
//                 <Thead>
//                   <Tr>
//                     <Th>Name</Th>
//                     <Th></Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   {operations.map((operation) => (
//                     <Tr key={operation.id}>
//                       <Td>{operation.name}</Td>
//                       <Td>
//                         <Button
//                           colorScheme="green"
//                           onClick={() => addOperation(operation)}
//                         >
//                           Add
//                         </Button>
//                       </Td>
//                     </Tr>
//                   ))}
//                 </Tbody>
//               </Table>
//             </TableContainer>
//           </CardBody>
//         </Card>
//       )}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import endpoint from "../utils/endpoint";

export default function OperationLib({ bundleGroup, listId, updateOperationLists }) {
  const [operationLibs, setOperationLibs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/operation_lib/`,
          { 
            params: { bundle_group: bundleGroup }, 
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            }, 
        }
        );

        setOperationLibs(response.data)
      } catch (error) {
        console.error("Error fetching operation libraries:", error);
      }
    };

    fetchData();
  }, [bundleGroup, listId, updateOperationLists]);

  const handleAddOperation = async (operation) => {
    try {
      const response = await axios.post(
        `${endpoint}/operation_list/`, 
        { 
          operations: operation.id, 
          list: listId 
        }, 
        { headers: 
          { Authorization: `JWT ${localStorage.getItem("access_token")}` } 
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Operation added successfully:", response.data);
        updateOperationLists(response.data); 
      } else {
        console.error("Failed to add operation:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding operation:", error.response ? error.response.data : error);
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
            {operationLibs.map((operation) => (
              <tr key={operation.id}>
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

 