// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Table from "react-bootstrap/Table";
// import endpoint from "../utils/endpoint";

// export default function OperationLibList({
//   bundleGroup,
//   listId,
//   updateOperationLists,
// }) {
//   const [operationLibs, setOperationLibs] = useState([]);
//   const [addedOperations, setAddedOperations] = useState([]);
//   const headers = {
//     Authorization: `JWT ${localStorage.getItem("access_token")}`,
//   };

//   const handleAddOperation = async (operation) => {
//     try {
//       const response = await axios.post(
//         `${endpoint}/operation_list/`,
//         {
//           list: listId,
//           operations: operation.id,
//         },
//         { headers }
//       );

//       // update added operations list
//       setAddedOperations((prevAddedOperations) => [
//         ...prevAddedOperations,
//         operation.id,
//       ]);

//       console.log("Operation added successfully:", response.data);

//       // update state directly without reloading the page
//       setOperationLibs((prevOperationLibs) =>
//         prevOperationLibs.map((op) =>
//           op.id === operation.id ? { ...op, added: true } : op
//         )
//       );
//       updateOperationLists();
//     } catch (error) {
//       console.error("Error adding operation:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${endpoint}/operation_lib/`, {
//           params: { bundle_group: bundleGroup },
//         });
//         setOperationLibs(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [bundleGroup, listId, updateOperationLists]);

//   return (
//     <Card>
//       <Card.Header>
//         <Card.Title>Operation Library</Card.Title>
//       </Card.Header>
//       <Card.Body>
//         <Table striped hover>
//           <thead>
//             <tr>
//               <th scope="col">Operation Code</th>
//               <th scope="col">Name</th>
//               {/* <th scope="col">Operated by</th> */}
//               <th scope="col">Add</th>
//             </tr>
//           </thead>
//           <tbody>
//             {operationLibs &&
//               operationLibs.map((operation) => (
//                 <tr key={operation.id}>
//                   <td>{operation.operation_code}</td>
//                   <td>{operation.name}</td>
//                   {/* <td>{operation.machine}</td> */}
//                   <td>
//                     <Button
//                       className="btn-success"
//                       onClick={() => handleAddOperation(operation)}
//                     >
//                       Add
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </Table>
//       </Card.Body>
//     </Card>
//   );
// }

import React, { memo } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useSWRConfig } from 'swr';
import endpoint from '../utils/endpoint';

const OperationLibList = memo(({ bundleGroup, listId, updateOperationLists }) => {
  const { mutate } = useSWRConfig();

  const handleAddOperation = async (operation) => {
    const updatedOperation = { ...operation, added: true }; // Example of an optimistic update
    mutate(`${endpoint}/operation_list/`, { ...operation, added: true }, false);

    try {
      await axios.post(`${endpoint}/operation_list/`, {
        list: listId,
        operations: operation.id,
      }, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });

      updateOperationLists();
    } catch (error) {
      console.error("Error adding operation:", error);
      // Rollback if needed
    }
  };

  // Assume operations are fetched elsewhere and passed as props, or use SWR here
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
              {/* <th scope="col">Operated by</th> */}
              <th scope="col">Add</th>
            </tr>
          </thead>
          <tbody>
            {operationLibs &&
              operationLibs.map((operation) => (
                <tr key={operation.id}>
                  <td>{operation.operation_code}</td>
                  <td>{operation.name}</td>
                  {/* <td>{operation.machine}</td> */}
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

});

export default OperationLibList;
