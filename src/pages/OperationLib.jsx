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
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import endpoint from "../utils/endpoint";

export default function OperationLibList({ bundleGroup, listId, updateOperationLists }) {
  const [operationLibs, setOperationLibs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_lib/`, {
          params: { bundle_group: bundleGroup },
        });
        const operationsWithAddedStatus = response.data.map(op => ({
          ...op,
          added: !!getOperationFromLocalStorage(op.id),
        }));
        setOperationLibs(operationsWithAddedStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bundleGroup, listId, updateOperationLists]);

  const handleAddOperation = (operation) => {
    // Update local storage immediately for UI update
    addOperationToLocalStorage(operation);
    setOperationLibs((prevOperationLibs) =>
      prevOperationLibs.map((op) =>
        op.id === operation.id ? { ...op, added: true } : op
      )
    );
    // Notify parent component to re-render the operation list
    updateOperationLists();

    // Asynchronously update the backend
    const headers = { Authorization: `JWT ${localStorage.getItem("access_token")}` };
    axios.post(`${endpoint}/operation_list/`, { list: listId, operations: operation.id }, { headers })
      .then(response => {
        console.log("Operation added successfully:", response.data);
      })
      .catch(error => {
        console.error("Error adding operation:", error);
      });
  };

  // Add operation to local storage for immediate UI reflection
  const addOperationToLocalStorage = (operation) => {
    let operations = JSON.parse(localStorage.getItem("operations") || "[]");
    operations.push(operation);
    localStorage.setItem("operations", JSON.stringify(operations));
  };

  // Check if operation is in local storage (used to set added status initially)
  const getOperationFromLocalStorage = (operationId) => {
    let operations = JSON.parse(localStorage.getItem("operations") || "[]");
    return operations.find(op => op.id === operationId);
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
              <th scope="col">Operation Code</th>
              <th scope="col">Name</th>
              <th scope="col">Add</th>
            </tr>
          </thead>
          <tbody>
            {operationLibs.map((operation) => (
              <tr key={operation.id}>
                <td>{operation.operation_code}</td>
                <td>{operation.name}</td>
                <td>
                  <Button
                    className={operation.added ? "btn-secondary" : "btn-success"}
                    onClick={() => handleAddOperation(operation)}
                    disabled={operation.added}
                  >
                    {operation.added ? "Added" : "Add"}
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
