import {
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function JobGroupCard({ job_group, operationsChanged }) {
  const { listId } = useParams();
  const [status, setStatus] = useState(getInitialStatus());

  function getInitialStatus() {
    const uniqueKey = `status-${listId}-${job_group.id}`;
    const savedStatus = localStorage.getItem(uniqueKey);

    if (savedStatus) return savedStatus;

    for (const bundleGroup of job_group.bundle_groups) {
      if (bundleGroup.operations_count > 0) return "in-progress";
    }
    return "no-progress";
  }

  function handleStatusChange() {
    const newStatus = status === "in-progress" ? "finished" : "in-progress";
    setStatus(newStatus);

    const uniqueKey = `status-${listId}-${job_group.id}`;
    localStorage.setItem(uniqueKey, newStatus);
  }

  useEffect(() => {
    const uniqueKey = `status-${listId}-${job_group.id}`;
    const savedStatus = localStorage.getItem(uniqueKey);
    if (savedStatus) {
      setStatus(savedStatus);
    }
  }, [job_group.id, listId]);

  useEffect(() => {
    function evaluateStatus() {
      const uniqueKey = `status-${listId}-${job_group.id}`;
      const currentStatus = localStorage.getItem(uniqueKey);

      if (currentStatus === "finished") {
        return;
      }

      let newStatus = "no-progress";
      for (const bundleGroup of job_group.bundle_groups) {
        if (bundleGroup.operations_count > 0) {
          newStatus = "in-progress";
          break;
        }
      }

      localStorage.setItem(uniqueKey, newStatus);
      setStatus(newStatus);
    }

    evaluateStatus();
  }, [job_group.bundle_groups, job_group.id, listId, operationsChanged]);

  return (
    <Card
      overflow="hidden"
      key={job_group.id}
      boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
    >
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "10px",
          paddingTop: "5px",
        }}
      >
        <span
          style={{
            height: "10px",
            width: "10px",
            borderRadius: "50%",
            backgroundColor:
              status === "in-progress"
                ? "orange"
                : status === "finished"
                ? "green"
                : "red",
          }}
        ></span>
        {status === "in-progress" && (
          <button onClick={handleStatusChange}>✔️</button>
        )}
        {status === "finished" && (
          <button onClick={handleStatusChange}>✔️</button>
        )}
      </div> */}

      
      <Image objectFit="cover" src="https://placehold.co/300x200" />

      <CardBody>
        <Flex alignItems="center" gap={2}>
          <Heading size="md">{job_group.name}</Heading>
          {/* <Icon as={TbCircleFilled} color="orange" boxSize="3" /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "10px",
              paddingTop: "5px",
            }}
          >
            <span
              style={{
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                backgroundColor:
                  status === "in-progress"
                    ? "orange"
                    : status === "finished"
                    ? "green"
                    : "red",
              }}
              
            ></span>
            {status === "in-progress" && (
              <button onClick={handleStatusChange}>✔️</button>
            )}
            {status === "finished" && (
              <button onClick={handleStatusChange}>✔️</button>
            )}
          </div>
        </Flex>

        {job_group.bundle_groups.map((bundle_group) => (
          <Flex
            key={bundle_group.id}
            alignItems="center"
            gap={2}
            justifyContent="space-between"
          >
            <Text>
              {status === "finished" ? (
                <Text style={{ color: "green" }}>{bundle_group.name}</Text>
              ) : (
                <Link
                  href={`/${listId}/job_group/${job_group.id}/${bundle_group.id}/operation`}
                >
                  {bundle_group.name}
                </Link>
              )}
            </Text>
            {/* <Text>{bundle_group.operations_count}</Text> */}
          </Flex>
        ))}
      </CardBody>
    </Card>
  );
}
