import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import BasicSpinner from "../components/Spinner";
import useGet from "../customed_hook/getData";
import endpoint from "../utils/endpoint";
import headers from "../utils/headers";
export default function YourListTable({ bundleId, listId }) {
  const tableStyle = {
    maxWidth: "80%",
    margin: "0 auto",
  };

  const params = {
    bundle_group: bundleId,
    listId: listId,
  };

  const { data: operationList, isLoading } = useGet(
    `${endpoint}/operation_list/`,
    params,
    headers
  );
  return (
    <div className="my-5" style={{ display: "flex", justifyContent: "center" }}>
      {isLoading ? (
        <BasicSpinner />
      ) : (
        <Table
          striped
          bordered
          hover
          style={{ ...tableStyle, textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>Operation Code</th>
              <th>Name</th>
              <th>Total SAM</th>
              <th># of Elements</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {operationList.map((item) => (
              <tr key={item.id}>
                <td>{item.operations.operation_code}</td>
                <td>{item.operations.name}</td>
                <td>{Number(item.total_sam).toFixed(2)}</td>
                <td>{item.element_count}</td>
                <td>
                  <Link
                    to={`/${listId}/operation/${item.operations.id}/${item.id}/element`}
                  >
                    <Button variant="success">Build Elements</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

// const [operationList, setOperationList] = useState([]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${endpoint}/operation_list/`, {
//         params: {
//           bundle_group: bundleId,
//           listId: listId,
//         },
//         headers: {
//           Authorization: `JWT ${localStorage.getItem("access_token")}`,
//         },
//       });
//       setOperationList(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchData();
// });
