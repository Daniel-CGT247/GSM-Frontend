// import React, { useState, useEffect } from "react";
// import Card from "react-bootstrap/Card";
// import { Link, useParams } from "react-router-dom";

// export default function JobGroupCard({ job_group, operationsChanged }) {
//   const { listId } = useParams();
//   const [status, setStatus] = useState(getInitialStatus())

//   const cardStyle = {
//     width: "18rem",
//     boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//     transition: "0.3s",
//     borderRadius: "10px",
//     height: "auto",
//   };

//   const cardTextStyle = {
//     maxHeight: "20em",
//     overflowY: "auto",
//     paddingRight: "5px",
//   };

//   const cardBodyStyle = {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     textAlign: "center",
//   };

//   const linkStyle = {
//     textDecoration: "none",
//     color: "blue",
//     cursor: "pointer",
//   };
  
//   function getInitialStatus() {
//     const uniqueKey = `status-${listId}-${job_group.id}`;
//     const savedStatus = localStorage.getItem(uniqueKey);

//     console.log(
//       `getInitialStatus: Retrieved status for ${uniqueKey}:`,
//       savedStatus,
//     )

//     if (savedStatus) return savedStatus

//     for (const bundleGroup of job_group.bundle_groups) {
//       if (bundleGroup.operations_count > 0) return "in-progress";
//     }
//     return "no-progress";
//   }

//   function handleStatusChange() {
//     const newStatus = status === "in-progress" ? "finished" : "in-progress";
//     setStatus(newStatus)
    
//     const uniqueKey = `status-${listId}-${job_group.id}`;
//     localStorage.setItem(uniqueKey, newStatus)

//     console.log(
//       `handleStatusChange: Updated status for ${uniqueKey}:`,
//       newStatus,
//     )
//   }

//   useEffect(() => {
//     const uniqueKey = `status-${listId}-${job_group.id}`;
//     const savedStatus = localStorage.getItem(uniqueKey);
//     if (savedStatus) {
//       setStatus(savedStatus)
//     }
//   }, [job_group.id, listId]);  

//   useEffect(() => {
//     function evaluateStatus() {
//       const uniqueKey = `status-${listId}-${job_group.id}`;
//       const currentStatus = localStorage.getItem(uniqueKey);

//       if (currentStatus === "finished") {
//         return
//       }

//       let newStatus = "no-progress";
//       for (const bundleGroup of job_group.bundle_groups) {
//         if (bundleGroup.operations_count > 0) {
//           newStatus = "in-progress";
//           break;
//         }
//       }

//       localStorage.setItem(uniqueKey, newStatus)
//       setStatus(newStatus)

//     }

//     evaluateStatus()
    
//   }, [job_group.bundle_groups, job_group.id, listId, operationsChanged]);


//   return (
//     <Card key={job_group.id} style={cardStyle}>
//       <Card.Img variant="top" src="https://placehold.co/200x100" />

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           paddingRight: "10px",
//           paddingTop: "5px",
//         }}
//       >
//         <span
//           style={{
//             height: "10px",
//             width: "10px",
//             borderRadius: "50%",
//             backgroundColor:
//               status === "in-progress"
//                 ? "orange"
//                 : status === "finished"
//                   ? "green"
//                   : "red",
//           }}
//         ></span>

//         {status === "in-progress" && (
//           <button onClick={handleStatusChange}>✔️</button>
//         )}
//         {status === "finished" && (
//           <button onClick={handleStatusChange}>✔️</button>
//         )}
//       </div>

//       <Card.Body style={cardBodyStyle}>
//         <Card.Title>{job_group.name}</Card.Title>

//         <div style={cardTextStyle}>
//           {job_group.bundle_groups.map((bundle_group) => (
//             <Card.Text key={bundle_group.id}>

//               {status === "finished" ? (
//                 <span style={{ color: "grey" }}>{bundle_group.name}</span>
//               ) : (
//                 <Link
//                   to={`/${listId}/job_group/${job_group.id}/${bundle_group.id}/operation`}
//                   style={linkStyle}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.textDecoration = "underline")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.textDecoration = "none")
//                   }
//                 >
//                   {bundle_group.name}
//                 </Link>


//               )}
//             </Card.Text>
//           ))}
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }
import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";

export default function JobGroupCard({ job_group, operationsChanged }) {
  const { listId } = useParams();
  const [status, setStatus] = useState(getInitialStatus());

  const cardStyle = {
    width: "18rem",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    borderRadius: "10px",
    height: "auto",
  };

  const cardTextStyle = {
    maxHeight: "20em",
    overflowY: "auto",
    paddingRight: "5px",
  };

  const cardBodyStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "blue",
    cursor: "pointer",
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

      <Card.Body style={cardBodyStyle}>
        <Card.Title>{job_group.name}</Card.Title>

        <div style={cardTextStyle}>
          {job_group.bundle_groups.map((bundle_group) => (
            <Card.Text key={bundle_group.id}>
              {status === "finished" ? (
                <span style={{ color: "grey" }}>{bundle_group.name}</span>
              ) : (
                <Link
                  to={`/${listId}/job_group/${job_group.id}/${bundle_group.id}/operation`}
                  style={linkStyle}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  {bundle_group.name}
                </Link>
              )}
            </Card.Text>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
