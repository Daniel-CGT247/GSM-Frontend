import React from "react";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import useGet from "../customed_hook/getData";
import endpoint from "../utils/endpoint";
import YourListTable from "./YourListTable";

export default function YourList() {
  const { listId, jobId, bundleId } = useParams();

  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  const jobGroup = useGet(`${endpoint}/job_group/${jobId}`);
  const bundle_group =
    jobGroup &&
    jobGroup.bundle_groups &&
    jobGroup.bundle_groups.find((bundle) => bundle.id == bundleId);
  const bundleName = bundle_group && bundle_group.name;

  return (
    <div className="p-5">
      <div className="flex items-center justify-center space-y-2 flex-col">
        <h1 className="font-bold">Your List - {bundleName}</h1>
        <h3 className="font-bold">Style {itemName}</h3>

        <Link to={`/${listId}/job_group/${jobId}/${bundleId}/operation`}>
          <Button variant="outline-secondary">Edit Operation List</Button>
        </Link>
      </div>
      <YourListTable
        className="rounded-md"
        bundleId={bundleId}
        listId={listId}
      />
    </div>
  );
}
