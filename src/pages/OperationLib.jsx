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
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

export default function OperationLibList({ 
  bundleGroup, 
  listId, 
  updateOperationLists 
}) {
  const [operationLibs, setOperationLibs] = useState([]);
  const headers = { 
    Authorization: `JWT ${localStorage.getItem("access_token")}` 
  };

  useEffect(() => {
    const storedOperationLibs = localStorage.getItem(`operationLibs_${bundleGroup}`);

    if (storedOperationLibs) {
      setOperationLibs(JSON.parse(storedOperationLibs));
    } else {
      fetchData(); 
    }
  }, [bundleGroup]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://gsm-app.vercel.app/operation_lib/", 
        { 
          params: { bundle_group: bundleGroup },
          headers,
      });
      setOperationLibs(response.data);
      localStorage.setItem(`operationLibs_${bundleGroup}`, JSON.stringify(response.data)); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddOperation = async (operation) => {
    const updatedOperationLibs = operationLibs.map(op =>
      op.id === operation.id ? { ...op, added: true } : op
    );
  
    // Update local state and localStorage first for immediate UI update
    setOperationLibs(updatedOperationLibs);
    localStorage.setItem(`operationLibs_${bundleGroup}`, JSON.stringify(updatedOperationLibs));
  
    // Then, asynchronously update the backend
    try {
      await axios.post(
        "https://gsm-app.vercel.app/operation_list/",
        {
          list: listId,
          operations: operation.id,
        },
        { headers }
      );
  
      // Optionally, confirm the operation was added and update UI as needed
      updateOperationLists(); 
    } catch (error) {
      console.error("Error adding operation:", error);
      // Handle error, possibly revert changes in UI if necessary
    }
  };
  
  return (
    <Card>
      <Card.Header><Card.Title>Operation Library</Card.Title></Card.Header>
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
                  <Button className="btn-success" onClick={() => handleAddOperation(operation)}>
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
