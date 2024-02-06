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

import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import OperationLibList from './OperationLibList';
import OperationList from './OperationList';
import endpoint from '../utils/endpoint';

const fetcher = url => axios.get(url, {
  headers: {
    Authorization: `JWT ${localStorage.getItem("access_token")}`,
  },
}).then(res => res.data);

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();

  const { data: styleNum } = useSWR(`${endpoint}/collection/${listId}`, fetcher);
  const { data: jobGroup } = useSWR(`${endpoint}/job_group/${jobId}`, fetcher);

  const bundleGroup = jobGroup?.bundle_groups?.find(bundle => bundle.id === bundleId);
  const [operationListKey, setOperationListKey] = useState(0);

  const updateOperationLists = useCallback(() => {
    setOperationListKey(prevKey => prevKey + 1);
  }, []);

  
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
              key={operationListKey}
              updateOperationLists={updateOperationLists}
              bundleName={bundleName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
