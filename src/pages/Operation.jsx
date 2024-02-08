import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import OperationLib from "./OperationLib";
import OperationList from "./OperationList";

export default function Operation() {
  const { listId, jobId, bundleId } = useParams();
  const { data: styleNum, isLoading: isStyleLoading } = useGet(
    `${endpoint}/collection/${listId}`
  );
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const { data: jobGroup, isLoading: isJobLoading } = useGet(
    `${endpoint}/job_group/${jobId}`
  );

  const bundle_group =
    jobGroup &&
    jobGroup.bundle_groups &&
    jobGroup.bundle_groups.find((bundle) => bundle.id.toString() === bundleId);
  const bundleName = bundle_group && bundle_group.name;
  // re-render OperationList
  const [operationListKey, setOperationListKey] = useState(0);

  const [updateOperations, setUpdateOperations] = useState([]);

  return (
    <div className="p-5">
      <div className="flex flex-col space-y-2 items-center justify-center">
        <h1 className="font-bold">
          Build Operation {!isJobLoading && <>- {bundleName}</>}
        </h1>

        {isStyleLoading ? (
          <StyleSkeleton />
        ) : (
          <h3 className="font-bold">Style {itemName}</h3>
        )}
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
            <OperationLib
              bundleId={bundleId}
              listId={listId}
              setUpdateFunc={setUpdateOperations}
            />
          </div>
          <div className="col space-y-10">
            <OperationList
              bundleId={bundleId}
              listId={listId}
              updateOperationList={updateOperations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
