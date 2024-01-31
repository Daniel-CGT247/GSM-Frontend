import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function JobGroupCard({ job_group, listId }) {
  const getStatus = () => {
    let inProgress = false

    for (const bundleGroup of job_group.bundle_groups) {
      if (bundleGroup.operations_count > 0) { inProgress = true; break }
    }
    return inProgress ? 'in-progress' : 'no-progress'

  };

  const status = getStatus()

  // const handleCheckmarkClick = () => {
  //   if (status === 'in-progress') {
  //     onStatusChange(job_group.id, 'finished')
  //   }
  // };

  const cardStyle = {
    width: "18rem",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", // add shadow to the card
    transition: "0.3s", // smooth transition for hover effect
    borderRadius: "10px", // round corners
    height: "auto",
  };

  const cardTextStyle = {
    maxHeight: "20em",
    overflowY: "auto",
    paddingRight: "5px",
  };

  const cardBodyStyle = {
    display: "flex", // use flexbox for alignment
    flexDirection: "column", // stack items vertically
    alignItems: "center", // center items horizontally
    textAlign: "center", // center text
  };

  return (
    <Card key={job_group.id} style={cardStyle}>
      <Card.Img variant="top" src="https://placehold.co/200x100" />

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
            backgroundColor: status === 'in-progress' ? 'orange' : 'red'
          }}
        ></span>
      </div>

      <Card.Body style={cardBodyStyle}>
        <Card.Title>{job_group.name}</Card.Title>
        <div style={cardTextStyle}>
          {job_group.bundle_groups.map((bundle_group) => (
            <Card.Text key={bundle_group.id}>
              <Link
                to={`/${listId}/job_group/${job_group.id}/${bundle_group.id}/operation`}
              >
                {bundle_group.name}
              </Link>
            </Card.Text>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
