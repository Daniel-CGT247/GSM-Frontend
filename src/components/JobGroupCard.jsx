import {
  Card,
  CardBody,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TbCircleFilled } from "react-icons/tb";
import { useParams } from "react-router-dom";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

export default function JobGroupCard({
  job_group,
  operationsChanged,
  statusChange,
  setStatusChange,
}) {
  const { listId } = useParams();
  const { data: operationList } = useGet(`${endpoint}/operation_list`);
  const [status, setStatus] = useState(getInitialStatus());
  const totalSamCal = (bundle_group) => {
    return operationList
      ? operationList
          .filter((item) => item.list === parseInt(listId))
          .filter(
            (item) =>
              item.operations &&
              item.operations.bundle_group &&
              item.operations.bundle_group === bundle_group
          )
          .reduce((acc, curr) => acc + curr.total_sam, 0)
      : 0;
  };

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
    setStatusChange(!statusChange);
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
      <Image
        objectFit="cover"
        src={job_group.image ? job_group.image : "https://placehold.co/300x200"}
        width="300px"
        height="200px"
      />

      <CardBody>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            <Heading size="md">{job_group.name}</Heading>
            <Icon
              as={TbCircleFilled}
              color={
                status === "in-progress"
                  ? "orange"
                  : status === "finished"
                  ? "green"
                  : "red"
              }
              boxSize="3"
            />
          </Flex>
          {status === "in-progress" && (
            <Checkbox
              borderColor={"orange"}
              onChange={handleStatusChange}
            ></Checkbox>
          )}
          {status === "finished" && (
            <Checkbox
              isChecked
              colorScheme="green"
              onChange={handleStatusChange}
            ></Checkbox>
          )}
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
                <Text color="green">{bundle_group.name}</Text>
              ) : (
                <Link
                  href={`/${listId}/job_group/${job_group.id}/${bundle_group.id}/operation`}
                >
                  {bundle_group.name}
                </Link>
              )}
            </Text>
            <Text color={status === "finished" && "green"}>
              {totalSamCal(bundle_group.name).toFixed(3)}
            </Text>
          </Flex>
        ))}
      </CardBody>
    </Card>
  );
}
