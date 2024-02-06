// import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
// import { Link, useParams } from "react-router-dom";
// import useGet from "../customed_hook/getData";
// import OperationLibList from "./OperationLib";
// import OperationList from "./OperationList";
// import endpoint from "../utils/endpoint";

// export default function Operation() {
//   const { listId, jobId, bundleId } = useParams();

//   const styleNum = useGet(`${endpoint}/collection/${listId}`);
//   const itemName = styleNum && styleNum.item && styleNum.item.name;

//   const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
//   const bundle_group =
//     jobGroup &&
//     jobGroup.bundle_groups &&
//     jobGroup.bundle_groups.find((bundle) => bundle.id == bundleId);
//   const bundleName = bundle_group && bundle_group.name;
//   // re-render OperationList
//   const [operationListKey, setOperationListKey] = useState(0);

//   // update OperationLists after an operation is deleted or added
//   const updateOperationLists = (operationId, deleted) => {
//     setOperationListKey((prevKey) => prevKey + 1);
//   };

//   return (
//     <div className="p-5">
//       <div className="flex flex-col space-y-2 items-center justify-center">
//         <h1 className="font-bold">Build Operation - {bundleName}</h1>

//         <h3 className="font-bold">Style {itemName}</h3>
//         <div className="space-x-5">
//           <Link to={`/${listId}/job_group`}>
//             <Button variant="outline-secondary">Back to Job Group</Button>
//           </Link>
//           <Link to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}>
//             <Button>Complete</Button>
//           </Link>
//         </div>
//       </div>
//       <div className="container text-center my-5">
//         <div className="row">
//           <div className="col">
//             <OperationLibList
//               bundleGroup={bundleId}
//               listId={listId}
//               updateOperationLists={updateOperationLists}
//             />
//           </div>
//           <div className="col space-y-10">
//             <OperationList
//               bundleGroup={bundleId}
//               listId={listId}
//               key={operationListKey}
//               updateOperationLists={updateOperationLists}
//               bundleName={bundleName}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import useGet from "../customed_hook/getData"; 
import endpoint from "../utils/endpoint";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const [operationLibs, setOperationLibs] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group =
    jobGroup &&
    jobGroup.bundle_groups &&
    jobGroup.bundle_groups.find((bundle) => bundle.id == bundleId);
  const bundleName = bundle_group && bundle_group.name;
  // re-render OperationList
  const [operationListKey, setOperationListKey] = useState(0);


  useEffect(() => {
    const fetchOperations = async () => {
      setIsLoading(true);
      try {
        // fetch operation libraries
        const libResponse = await axios.get(`${endpoint}/operation_lib/?bundle_group=${bundleId}`);
        setOperationLibs(libResponse.data);

        // fetch existing operations in the list
        const listResponse = await axios.get(`${endpoint}/operation_list/?bundle_group=${bundleId}`);
        setOperationList(listResponse.data);
      } catch (error) {
        console.error("Failed to fetch operations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperations();
  }, [listId, jobId, bundleId]);

  const handleAddOperation = async (operation) => {
    try {
      const response = await axios.post(
        `${endpoint}/operation_list/`,
        { list: listId, operations: operation.id },
        { headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` } }
      );
 
      const newOperation = {
        ...response.data,
        operations: {
          ...operation, 
        }
      };
      setOperationList(prev => [...prev, newOperation]);
    } catch (error) {
      console.error("Error adding operation:", error);
    }
  };
  

  const handleDelete = async (operationId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationId}`);
      // Reflect the deletion immediately in the UI
      setOperationList(prev => prev.filter(op => op.id !== operationId));
    } catch (error) {
      console.error("Error deleting operation:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  
  return (
    <div className="container p-5">
      <div className="text-center">
        <h1>Build Operation - {bundleName}</h1>
        <h3>Style {itemName}</h3>
        <div>
          <Link to={`/${listId}/job_group`}>
            <Button variant="outline-secondary" className="me-2">Back to Job Group</Button>
          </Link>
          <Link to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}>
            <Button variant="primary">Complete</Button>
          </Link>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <OperationLibList
            operationLibs={operationLibs}
            handleAddOperation={handleAddOperation}
          />
        </div>
        <div className="col-md-6">
          <OperationList
            operationList={operationList}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}




const OperationLibList = ({ operationLibs, handleAddOperation }) => (
  
  <Card>
    <Card.Header>Operation Library</Card.Header>
    <Card.Body>
      <Table >
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

const OperationList = ({ operationList, handleDelete }) => (
  <Card>
    <Card.Header>Operation List</Card.Header>
    <Card.Body>
      <Table >
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
              {/* Access the operation_code and name through the operations object */}
              <td>{item.operations.operation_code}</td>
              <td>{item.operations.name}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);


