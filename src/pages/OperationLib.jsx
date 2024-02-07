// import axios from "axios";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Table from "react-bootstrap/Table";
// import headers from "../utils/headers";
// import endpoint from "../utils/endpoint";

// export default function OperationLib({ operationLibs, onAdd, listId }) {
//   const handleAddOperation = async (operation) => {
//     try {
//       await axios.post(
//         `${endpoint}/operation_list/`,
//         {
//           list: listId,
//           operations: operation.id,
//         },
//         { headers: headers }
//       );
//       const list = await axios.get(`${endpoint}/operation_list/`);
//     } catch (error) {
//       console.error("Error adding operation:", error);
//     }
//   };
//   return (
//     <Card>
//       <Card.Header>
//         <Card.Title>Operation Library</Card.Title>
//       </Card.Header>
//       <Card.Body>
//         <Table striped hover>
//           <thead>
//             <tr>
//               <th scope="col">Name</th>
//               <th scope="col">Add</th>
//             </tr>
//           </thead>
//           <tbody>
//             {operationLibs &&
//               operationLibs.map((operation) => (
//                 <tr key={operation.id}>
//                   <td>{operation.name}</td>
//                   <td>
//                     <Button
//                       className="btn-success"
//                       onClick={() => {
//                         onAdd(operation.id);
//                         handleAddOperation(operation);
//                       }}
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
        

        setOperationLibs(response.data);
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
        { operations: operation.id, list: listId }, 
        { headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` } }
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