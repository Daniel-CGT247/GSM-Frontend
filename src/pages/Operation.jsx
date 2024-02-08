// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
// import { Link, useParams } from "react-router-dom";
// import BasicSpinner from "../components/Spinner";
// import useGet from "../customed_hook/getData";
// import headers from "../utils/headers";
// import endpoint from "../utils/endpoint";
// import OperationLib from "./OperationLib";
// import OperationList from "./OperationList";

// export default function Operation() {
//   const { listId, jobId, bundleId } = useParams();
//   const { data: styleNum, isLoading: isStyleLoading } = useGet(
//     `${endpoint}/collection/${listId}`
//   );
//   const { data: jobGroup, isLoading: isJobLoading } = useGet(
//     `${endpoint}/job_group/${jobId}`
//   );
//   const itemName = styleNum && styleNum.item && styleNum.item.name;
//   const bundle_group =
//     jobGroup &&
//     jobGroup.bundle_groups &&
//     jobGroup.bundle_groups.find((bundle) => bundle.id == bundleId);
//   const bundleName = bundle_group && bundle_group.name;

//   const paramsLib = { bundle_group: bundleId };
//   const paramList = { bundle_group: bundleId, listId: listId };
//   const [operations, setOperations] = useState([]);
//   const [isLibLoading, SetIsLibLoading] = useState(true);
//   useEffect(() => {
//     try {
//       if (localStorage.getItem("access_token") === null) {
//         window.location.href = "/login";
//       }
//       getData();
//     } catch (error) {
//       SetIsLibLoading(false);
//       console.log("Error:", error);
//     }
//   }, []);

//   let getData = async () => {
//     let res = await axios.get(`${endpoint}/operation_lib/`, {
//       params: paramsLib,
//     });
//     setOperations(res.data);
//     SetIsLibLoading(false);
//   };

//   const [operationList, setOperationList] = useState([]);
//   const [isListLoading, setIsListLoading] = useState(true);
//   useEffect(() => {
//     try {
//       if (localStorage.getItem("access_token") === null) {
//         window.location.href = "/login";
//       }
//       getList();
//     } catch (error) {
//       setIsListLoading(false);
//       console.log("Error:", error);
//     }
//   }, []);

//   let getList = async () => {
//     let res = await axios.get(`${endpoint}/operation_list/`, {
//       params: paramList,
//       headers: headers,
//     });
//     setOperationList(res.data);
//     setIsListLoading(false);
//   };
//   console.log(operationList);

//   return (
//     <div className="p-5">
//       <div className="flex flex-col space-y-2 items-center justify-center">
//         <h1 className="font-bold">
//           Build Operation {!isJobLoading && <>- {bundleName} </>}
//         </h1>
//         {isStyleLoading ? (
//           <BasicSpinner />
//         ) : (
//           <h3 className="font-bold">Style {itemName}</h3>
//         )}
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
//             {isLibLoading ? (
//               <BasicSpinner />
//             ) : (
//               <OperationLib
//                 operationLibs={operations}
//                 onAdd={(id) => {
//                   setOperationList([
//                     ...operationList,
//                     {
//                       operations: operations[id - 1],
//                       id: operationList.length + 1,
//                     },
//                   ]);
//                 }}
//                 listId={listId}
//               />
//             )}
//           </div>
//           <div className="col space-y-10">
//             {isListLoading ? (
//               <BasicSpinner />
//             ) : (
//               <OperationList
//                 operationList={operationList}
//                 onDelete={(id) =>
//                   setOperationList(operationList.filter((e) => e.id !== id))
//                 }
//                 bundleGroup={bundleId}
//                 listId={listId}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import useGet from "../customed_hook/getData";
import OperationLibList from "./OperationLib";
import OperationList from "./OperationList";
import endpoint from "../utils/endpoint";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const jobGroup = useGet(`http://127.0.0.1:8000/job_group/${jobId}`);
  const bundle_group = jobGroup?.bundle_groups?.find(bundle => bundle.id.toString() === bundleId);
  const bundleName = bundle_group?.name ?? 'Loading...';
  
  // re-render OperationList
  const [operationListKey, setOperationListKey] = useState(0);

  
  const [operationList, setOperationList] = useState([]);

  const updateOperationLists = (newOperation) => {
    setOperationList((prevOperationList) => [...prevOperationList, newOperation]);
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
              bundleGroup={bundleId}
              listId={listId}
              updateOperationLists={updateOperationLists} 
            />
          </div>
          <div className="col space-y-10">
          <OperationList
            bundleGroup={bundleId}
            listId={listId}
            operationList={operationList} 
            bundleName={bundleName}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
