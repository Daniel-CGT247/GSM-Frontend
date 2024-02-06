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
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import endpoint from "../utils/endpoint";

export default function OperationList({ bundleGroup, listId, updateOperationLists }) {
  const [operationList, setOperationList] = useState([]);

  useEffect(() => {
    // Initially load from local storage, then sync with backend if needed
    const operations = JSON.parse(localStorage.getItem("operations") || "[]");
    setOperationList(operations.filter(op => op.bundleGroup === bundleGroup));
  }, [bundleGroup, listId, updateOperationLists]);

  const handleDelete = (operationId) => {
    // Update local storage immediately for UI update
    const updatedOperations = removeOperationFromLocalStorage(operationId);
    setOperationList(updatedOperations.filter(op => op.bundleGroup === bundleGroup));

    // Asynchronously delete from backend
    const headers = { Authorization: `JWT ${localStorage.getItem("access_token")}` };
    axios.delete(`${endpoint}/operation_list/${operationId}`, { headers })
      .then(response => {
        console.log("Operation deleted successfully:", response.data);
        // Optionally refresh the list from the backend here
      })
      .catch(error => {
        console.error("Error deleting operation:", error);
      });
  };

  // Remove operation from local storage
  const removeOperationFromLocalStorage = (operationId) => {
    let operations = JSON.parse(localStorage.getItem("operations") || "[]");
    const filteredOperations = operations.filter(op => op.id !== operationId);
    localStorage.setItem("operations", JSON.stringify(filteredOperations));
    return filteredOperations;
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
                <td>{item.operation_code}</td>
                <td>{item.name}</td>
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
