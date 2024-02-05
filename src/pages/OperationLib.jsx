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
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Button from "react-bootstrap/Button";
// import Table from "react-bootstrap/Table";
// import Card from "react-bootstrap/Card";
// import endpoint from "../utils/endpoint";

// export default function OperationLibList({
//   bundleGroup,
//   listId,
//   updateOperationLists,
// }) {
//   const [operationLibs, setOperationLibs] = useState([]);
//   const [addedOperations, setAddedOperations] = useState(new Set()); 
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

//       const newAddedOperations = new Set(addedOperations)
//       newAddedOperations.add(operation.id)
//       setAddedOperations(newAddedOperations)

//       console.log("Operation added successfully:", response.data)

//       setOperationLibs(prevOperationLibs =>
//         prevOperationLibs.map(op =>
//           op.id === operation.id ? { ...op, added: true } : op
//         )
//       );
//       updateOperationLists(operation.id, true);
//     } catch (error) {
//       console.error("Error adding operation:", error);

      
//       setAddedOperations(prevAddedOperations => {
//         const rollback = new Set(prevAddedOperations)
//         rollback.delete(operation.id)
//         return rollback
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${endpoint}/operation_lib/?bundle_group=${bundleGroup}`,
//           { headers }
//         );
//         setOperationLibs(response.data.map(op => ({
//           ...op,
//           added: addedOperations.has(op.id),
//         })));
//       } catch (error) {
//         console.error("Error fetching operation libraries:", error)
//       }
//     };

//     fetchData();
//   }, [bundleGroup, listId]);

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
//               <th scope="col">Add</th>
//             </tr>
//           </thead>
//           <tbody>
//             {operationLibs.map((operation) => (
//               <tr key={operation.id}>
//                 <td>{operation.operation_code}</td>
//                 <td>{operation.name}</td>
//                 <td>
//                   <Button
//                     className="btn-success"
//                     onClick={() => handleAddOperation(operation)}
//                   >
//                     Add
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Card.Body>
//     </Card>
//   );
// }
import React from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

const OperationLibList = ({ operationLibs, handleAddOperation }) => {
  return (
    <Card>
      <Card.Header>Operation Library</Card.Header>
      <Card.Body>
        <Table striped hover>
          <thead>
            <tr>
              <th>Operation Code</th>
              <th>Name</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {operationLibs.map((operation) => (
              <tr key={operation.id}>
                <td>{operation.operation_code}</td>
                <td>{operation.name}</td>
                <td>
                  <Button onClick={() => handleAddOperation(operation)}>
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
};

export default OperationLibList;
