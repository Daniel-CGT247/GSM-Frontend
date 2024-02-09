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

  const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group = jobGroup?.bundle_groups?.find(bundle => bundle.id.toString() === bundleId);
  const bundleName = bundle_group?.name ?? 'Loading...';

  
  const [operationList, setOperationList] = useState([]);

  const updateOperationLists = (newOperation) => {

    setOperationList((prevOperationList) => {
      const tempOperation = {
        ...newOperation,
        id: newOperation.id || `temp-${Date.now()}`, 
      };
  
      return [...prevOperationList, tempOperation];
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
              bundleGroup={bundleId}
              listId={listId}
              updateOperationLists={updateOperationLists} 
            />
          </div>
        
          <div className="col space-y-10">
          <OperationList
            key={operationList.length} 
            bundleGroup={bundleId}
            listId={listId}
            operationListProp={operationList}
            bundleName={bundleName}
          />
          </div>

        </div>
      </div>
    </div>
  );
}
