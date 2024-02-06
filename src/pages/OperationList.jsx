// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Table from "react-bootstrap/Table";
// import endpoint from "../utils/endpoint";

// export default function OperationList({
//   bundleGroup,
//   listId,
//   updateOperationLists,
// }) {
//   const [operationList, setOperationList] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${endpoint}/operation_list/`, {
//           params: {
//             bundle_group: bundleGroup,
//             listId: listId,
//           },
//           headers: {
//             Authorization: `JWT ${localStorage.getItem("access_token")}`,
//           },
//         });
//         setOperationList(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [bundleGroup, listId]);

//   const handleDelete = (operationListId, operationId) => {
//     axios
//       .delete(`${endpoint}/operation_list/${operationListId}`, {
//         headers: {
//           Authorization: `JWT ${localStorage.getItem("access_token")}`,
//         },
//       })
//       .then((response) => {
//         const newList = operationList.filter(
//           (item) => item.id !== operationListId
//         );
//         setOperationList(newList);

//         // notify Operation to update OperationLists
//         updateOperationLists(operationId, false);
//       })
//       .catch((error) => {
//         console.error("Error deleting data:", error);
//       });
//   };

//   return (
//     <Card>
//       <Card.Header>
//         <Card.Title>Operation List</Card.Title>
//       </Card.Header>
//       <Card.Body>
//         <Table striped hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Operation Code</th>
//               <th>Name</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {operationList.map((item, index) => (
//               <tr key={item.id}>
//                 <td>{index + 1}</td>
//                 <td>{item.operations.operation_code}</td>
//                 <td>{item.operations.name}</td>
//                 <td>
//                   <Button
//                     className="btn-danger"
//                     onClick={() => handleDelete(item.id)}
//                   >
//                     Delete
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
import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import endpoint from "../utils/endpoint";

export default function OperationList({
  bundleGroup,
  listId,
  updateOperationLists,
}) {
  const [operationList, setOperationList] = useState([]);

  useEffect(() => {
    // Load operations from localStorage first for immediate UI update
    const localAddedOperations = JSON.parse(localStorage.getItem('addedOperations') || '[]');
    if (localAddedOperations.length > 0) {
      setOperationList(localAddedOperations.map(id => ({ id, operations: { operation_code: "Loading...", name: "Loading..." }})));
    }
  
    // Then fetch the latest data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_list/`, {
          params: { bundle_group: bundleGroup, listId: listId },
          headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
        });
        setOperationList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [bundleGroup, listId]);
  

  const handleDelete = (operationListId) => {
    // Update UI immediately
    const updatedList = operationList.filter(item => item.id !== operationListId);
    setOperationList(updatedList);
    localStorage.setItem('operations', JSON.stringify(updatedList));
  
    // Async deletion from backend
    axios.delete(`${endpoint}/operation_list/${operationListId}`, {
      headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
    }).catch(error => {
      console.error("Error deleting operation:", error);
      // Optionally handle re-adding the operation on error
    });
  
    updateOperationLists();
  };
  
  

  return (
    <Card>
      <Card.Header>
        <Card.Title>Operation List</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table striped hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Operation Code</th>
              <th>Name</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {operationList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.operations.operation_code}</td>
                <td>{item.operations.name}</td>
                <td>
                  <Button
                    className="btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
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
