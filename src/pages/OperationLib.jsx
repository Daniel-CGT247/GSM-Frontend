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

import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import endpoint from "../utils/endpoint";

export default function OperationLibList({
  bundleGroup,
  listId,
  updateOperationLists,
}) {
  const [operationLibs, setOperationLibs] = useState([]);
  const [addedOperations, setAddedOperations] = useState([]);
  const headers = {
    Authorization: `JWT ${localStorage.getItem("access_token")}`,
  };

  const handleAddOperation = async (operation) => {
    const newOperation = { ...operation, added: true };
    
    // Update UI immediately
    setOperationLibs((prevOperationLibs) =>
      prevOperationLibs.map((op) => (op.id === operation.id ? newOperation : op))
    );
    
    // Also update local storage to include this operation as added
    let operationsInLocalStorage = JSON.parse(localStorage.getItem('operations') || '[]');
    operationsInLocalStorage.push(newOperation);
    localStorage.setItem('operations', JSON.stringify(operationsInLocalStorage));
    
    updateOperationLists();
  
    // Attempt to sync with the backend
    try {
      await axios.post(
        `${endpoint}/operation_list/`,
        { list: listId, operations: operation.id },
        { headers }
      );
      // If successful, no action needed here since UI is already updated
    } catch (error) {
      console.error("Error adding operation:", error);
      // Optionally handle error, e.g., by retrying or showing an error message
    }
  };
  
  
  useEffect(() => {
    // Load operations from localStorage for immediate feedback
    const operationsFromStorage = JSON.parse(localStorage.getItem('operations') || '[]');
    if (operationsFromStorage.length > 0) {
      setOperationList(operationsFromStorage);
    }
  
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_list/`, {
          params: { bundle_group: bundleGroup, listId: listId },
          headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
        });
        // Update the local storage and state with the latest from server
        localStorage.setItem('operations', JSON.stringify(response.data));
        setOperationList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [bundleGroup, listId, updateOperationLists]);
  

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
}

