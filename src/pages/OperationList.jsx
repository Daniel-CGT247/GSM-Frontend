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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/operation_list/`, {
          params: {
            bundle_group: bundleGroup,
            listId: listId,
          },
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        });
        setOperationList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bundleGroup, listId]);

  const handleDelete = (operationListId, operationId) => {
    axios
      .delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        const newList = operationList.filter(
          (item) => item.id !== operationListId
        );
        setOperationList(newList);

        // notify Operation to update OperationLists
        updateOperationLists(operationId, false);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
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

// import axios from "axios";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Table from "react-bootstrap/Table";
// import headers from "../utils/headers";
// import endpoint from "../utils/endpoint";

// export default function OperationList({ operationList, onDelete }) {
//   const handleDelete = (operationListId) => {
//     axios
//       .delete(`${endpoint}/operation_list/${operationListId}`, {
//         headers: headers,
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
//             {operationList &&
//               operationList.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{item.operations.operation_code}</td>
//                   <td>{item.operations.name}</td>
//                   <td>
//                     <Button
//                       className="btn-danger"
//                       onClick={() => {
//                         onDelete(item.id);
//                         handleDelete(item.id);
//                       }}
//                     >
//                       Delete
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