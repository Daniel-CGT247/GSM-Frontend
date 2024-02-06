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
import endpoint from "../utils/endpoint";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();

  // Fetching style and job group information
  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group = jobGroup && jobGroup.bundle_groups && jobGroup.bundle_groups.find(bundle => bundle.id === bundleId);
  const bundleName = bundle_group && bundle_group.name;

  // States for operation libraries and lists
  const [operationLibs, setOperationLibs] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [operations, setOperations] = useState({}); // Operations now keyed by listId


  // useEffect(() => {
  //   // Fetch operation libraries
  //   const fetchOperationLibs = async () => {
  //     try {
  //       const response = await axios.get(`${endpoint}/operation_lib/?bundle_group=${bundleId}`);
  //       setOperationLibs(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch operation libraries:", error);
  //     }
  //   };

  //   // Fetch operation list
  //   const fetchOperationList = async () => {
  //     try {
  //         const response = await axios.get(`${endpoint}/operation_list/?list_id=${listId}&bundle_group=${bundleId}`, {
  //             headers: {
  //                 Authorization: `JWT ${localStorage.getItem("access_token")}`,
  //             },
  //         });
  //         setOperations(prev => ({ ...prev, [listId]: response.data }));
  //     } catch (error) {
  //         console.error("Failed to fetch operation list:", error);
  //     }
  // };

  //   fetchOperationLibs();
  //   fetchOperationList();
  // }, [listId, jobId, bundleId]); // Re-fetch when these parameters change

  useEffect(() => {
    // Fetch operation libraries and list
    const fetchData = async () => {
      try {
        const [libsResponse, listResponse] = await Promise.all([
          axios.get(`${endpoint}/operation_lib/?bundle_group=${bundleId}`),
          axios.get(`${endpoint}/operation_list/?list_id=${listId}&bundle_group=${bundleId}`, {
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            },
          }),
        ]);

        setOperationLibs(libsResponse.data);
        setOperations(prev => ({
          ...prev,
          [`${listId}-${bundleId}`]: listResponse.data, // Key by both listId and bundleId
        }));        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [listId, jobId, bundleId]);


// // Update function for operation list
// const updateOperationList = (operation, isDelete = false) => {
//   setOperations(prev => {
//       const listOperations = prev[listId] || [];
//       if (isDelete) {
//           return { ...prev, [listId]: listOperations.filter(op => op.id !== operation.id) };
//       } else {
//           // Check if operation already exists
//           const operationExists = listOperations.some(op => op.id === operation.id);
//           if (!operationExists) {
//               return { ...prev, [listId]: [...listOperations, operation] };
//           }
//           return prev; // Return previous state if operation already exists
//       }
//   });
// };
  // // Update function for operation list, now scoped by listId and bundleId
  // const updateOperationList = (operation, isDelete = false) => {
  //   setOperations(prev => {
  //     const operationsKey = `${listId}-${bundleId}`;
  //     const listOperations = prev[operationsKey] || [];
  //     if (isDelete) {
  //       return {
  //         ...prev,
  //         [operationsKey]: listOperations.filter(op => op.id !== operation.id),
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         [operationsKey]: [...listOperations, operation],
  //       };
  //     }
  //   });
  // };
  const updateOperationList = (operation, isDelete = false) => {
    setOperations(prev => {
      const operationsKey = `${listId}-${bundleId}`;
      const listOperations = prev[operationsKey] || [];
      if (isDelete) {
        return {
          ...prev,
          [operationsKey]: listOperations.filter(op => op.id !== operation.id),
        };
      } else {
        const operationExists = listOperations.some(op => op.id === operation.id);
        if (!operationExists) {
          return {
            ...prev,
            [operationsKey]: [...listOperations, operation],
          };
        }
        return prev; // Return previous state if operation already exists
      }
    });
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
                listId={listId}
                token={localStorage.getItem("access_token")}
                updateOperationList={(operation) => updateOperationList(operation, false)}
            />
          </div>
          <div className="col space-y-10">
          {/* <OperationList
                operationList={operations[listId] || []}
                token={localStorage.getItem("access_token")}
                updateOperationList={(operationId) => updateOperationList(operationId, true)}
            /> */}

          <OperationList
            operationList={operations[`${listId}-${bundleId}`] || []}
            token={localStorage.getItem("access_token")}
            updateOperationList={(operationId) => updateOperationList(operationId, true)}
          />

          </div>
        </div>
      </div>
    </div>
  );
}
