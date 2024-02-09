import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import JobGroupCard from "../components/JobGroupCard";
import BasicSpinner from "../components/Spinner";
import StyleSkeleton from "../components/StyleSkeleton";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

export default function JobGroup() {
  const { listId } = useParams();
  const params = { listId: listId };
  const { isLoading, data } = useGet(`${endpoint}/job_group/`, params);
  const { isLoading: styleLoading, data: styleNum } = useGet(
    `${endpoint}/collection/${listId}`
  );

  const itemName = styleNum && styleNum.item && styleNum.item.name;

  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="font-bold">Job Group</h1>
        {styleLoading ? (
          <StyleSkeleton />
        ) : (
          <h3 className="font-bold">Style {itemName}</h3>
        )}
        <Link to="/Collection">
          <Button variant="outline-secondary">Back to Collection</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center flex-wrap gap-10 my-5">
          <BasicSpinner />
        </div>
      ) : (
        <div className="flex justify-center flex-wrap gap-10 my-5">
          {data.map((job_group) => (
            <JobGroupCard
              key={job_group}
              job_group={job_group}
              listId={listId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
