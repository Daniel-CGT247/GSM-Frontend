import { Skeleton } from "@chakra-ui/react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

export default function TableSkeleton({ header, columns }) {
  const rows = [1, 2, 3, 4, 5];
  return (
    <Card>
      <Card.Header>
        <Card.Title>{header}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table striped hover>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                {columns.map((col) => (
                  <td key={col}>
                    <Skeleton mt={4} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
