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
import useGet from "../customed_hook/getData";
import OperationLibList from "./OperationLib"; 
import OperationList from "./OperationList"; 

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();

  // fetching style and job group information
  const styleNum = useGet(`http://127.0.0.1:8000/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;
  const jobGroup = useGet(`http://127.0.0.1:8000/job_group/${jobId}`);
  const bundle_group = jobGroup && jobGroup.bundle_groups && jobGroup.bundle_groups.find(bundle => bundle.id === bundleId);
  const bundleName = bundle_group && bundle_group.name;

  const [operationLibs, setOperationLibs] = useState([]);
  const [operationList, setOperationList] = useState([]);

  useEffect(() => {
    // fetch operation lib
    const fetchOperationLibs = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/operation_lib/?bundle_group=${bundleId}`);
        setOperationLibs(response.data);
      } catch (error) {
        console.error("Failed to fetch operation libraries:", error);
      }
    };

    // fetch operation list
    const fetchOperationList = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/operation_list/?bundle_group=${bundleId}`);
        setOperationList(response.data);
      } catch (error) {
        console.error("Failed to fetch operation list:", error);
      }
    };

    fetchOperationLibs();
    fetchOperationList();
  }, [listId, jobId, bundleId]); // re-fetch when these parameters change

  // add an operation
  const handleAddOperation = async (selectedOperation) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/operation_list/`, {
        list: listId,
        operations: selectedOperation.id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      // expected structure
      const newOperation = {
        ...response.data,
        operations: {
          ...response.data.operations,
          operation_code: selectedOperation.operation_code,
          name: selectedOperation.name
        }
      };
      setOperationList(prev => [...prev, newOperation]);
    } catch (error) {
      console.error("Error adding operation:", error);
    }
  };
  

  // delete an operation
  const handleDelete = async (operationId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/operation_list/${operationId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`
        }
        
      });
      setOperationList(prev => prev.filter(op => op.id !== operationId));
    } catch (error) {
      console.error("Error deleting operation:", error);
    }
  };

  return (
    <div className="p-5">
      <div className="flex flex-col space-y-2 items-center justify-center">
        <h1 className="font-bold">Build Operation - {bundleName}</h1>
        <h3 className="font-bold">Style {itemName}</h3>
        <div className="space-x-5">
          <Link to={`/${listId}/job_group`}>
            <Button variant="outline-secondary">Back to Job Group</Button>
          </Link>
          <Link to={`/${listId}/job_group/${jobId}/${bundleId}/your_list`}>
            <Button>Complete</Button>
          </Link>
        </div>
      </div>

      <div className="container text-center my-5">
        <div className="row">
          <div className="col">
            <OperationLibList
              operationLibs={operationLibs}
              handleAddOperation={handleAddOperation}
            />
          </div>
          <div className="col space-y-10">
            <OperationList
              operationList={operationList}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}
