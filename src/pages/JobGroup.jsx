import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import JobGroupCard from "../components/JobGroupCard";
import useGet from "../customed_hook/getData";
import endpoint from "../utils/endpoint";

export default function JobGroup() {
  const { listId } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endpoint}/job_group/`, {
          params: { listId: listId },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [listId]);

  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;

  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="font-bold">Job Group</h1>
        <h3 className="font-bold">Style {itemName}</h3>
        <Link to="/Collection">
          <Button variant="outline-secondary">Back to Collection</Button>
        </Link>
      </div>
      <div className="flex justify-center flex-wrap gap-10 my-5">
        {data.map((job_group) => (
          <JobGroupCard job_group={job_group} listId={listId} />
        ))}
      </div>
    </div>
  );
}
