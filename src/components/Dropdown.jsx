import React from "react";
import { Select } from "@chakra-ui/react";
import useGet from "../customed_hook/getData";
import endpoint from "../utils/endpoint";
import headers from "../utils/headers";

export default function Dropdown(operationId) {
  const { expanding } = useGet(`${endpoint}/operation_code/?${operationId}`, {
    headers: headers,
  });

  return (
    <>
      <Select placeholder="Select option">
        {expanding.name &&
          expanding.name.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
      </Select>
    </>
  );
}
