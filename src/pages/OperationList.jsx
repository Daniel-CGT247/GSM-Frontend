// import {
//   Alert,
//   AlertDescription,
//   AlertIcon,
//   AlertTitle,
//   Button,
//   Menu,
//   MenuButton,
//   MenuItemOption,
//   MenuList,
//   MenuOptionGroup,
//   Table,
//   TableContainer,
//   Tbody,
//   Td,
//   Th,
//   Thead,
//   Tr,
//   Card,
//   CardBody,
//   CardHeader,
//   Text,
//   TableCaption,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { useState } from "react";
// import { FaChevronDown } from "react-icons/fa6";
// import TableSkeleton from "../components/TableSkeleton";
// import useGet from "../customed_hook/useGet";
// import endpoint from "../utils/endpoint";
// import headers from "../utils/headers";

// const columns = ["#", "Name", "Description", "Job #", ""];

// export default function OperationList({
//   bundleId,
//   listId,
//   updateOperationList,
// }) {
//   const paramList = { bundle_group: bundleId, listId: listId };
//   const {
//     data: operationList,
//     setData: setOperationList,
//     isLoading: isOperationListLoading,
//   } = useGet(`${endpoint}/operation_list`, paramList, updateOperationList);

//   const [selectedDesc, setSelectedDesc] = useState("");

//   const [error, setError] = useState(false);

//   const handleDelete = async (operationListId) => {
//     try {
//       await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
//         headers: headers,
//       });
//       setOperationList((operationList) =>
//         operationList.filter((item) => item.id !== operationListId)
//       );
//       setError(false);
//     } catch (error) {
//       console.error("Error deleting operation:", error);
//       setError(true);
//       setTimeout(() => {
//         setError(false);
//       }, 5000);
//     }
//   };

//   return (
//     <>
//       {isOperationListLoading ? (
//         <TableSkeleton header="Operation List" columns={columns} />
//       ) : (
//         <Card>
//           {error && (
//             <Alert status="error">
//               <AlertIcon />
//               <AlertTitle>Cannot Delete Operation</AlertTitle>
//               <AlertDescription>
//                 Please remove the elements list first
//               </AlertDescription>
//             </Alert>
//           )}

//           <CardBody>
//             <TableContainer>
//               <Table variant="striped" colorScheme="gray">
//                 <TableCaption placement="top" bgColor="gray.50">
//                   <Text as="h4">Operation List</Text>
//                 </TableCaption>

//                 <Thead>
//                   <Tr>
//                     <Th>#</Th>
//                     <Th>Name</Th>
//                     <Th>Description</Th>
//                     <Th>Job #</Th>
//                     <Th></Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   {operationList.map((item, index) => (
//                     <Tr key={item.id}>
//                       <Td>{index + 1}</Td>
//                       <Td>{item.operations.name}</Td>
//                       <Td>
//                         <ExpandingName
//                           operationId={item.operations.id}
//                           operationListId={item.id}
//                           setSelectedDesc={setSelectedDesc}
//                           item={item}
//                         />
//                       </Td>
//                       <Td>
//                         {item.expanding_field &&
//                         item.expanding_field.operation_code ? (
//                           item.expanding_field.operation_code
//                         ) : (
//                           <JobCode
//                             operationId={item.operations.id}
//                             description={selectedDesc}
//                           />
//                         )}
//                       </Td>
//                       <Td>
//                         <Button
//                           colorScheme="red"
//                           onClick={() => handleDelete(item.id)}
//                         >
//                           Delete
//                         </Button>
//                       </Td>
//                     </Tr>
//                   ))}
//                 </Tbody>
//               </Table>
//             </TableContainer>
//           </CardBody>
//         </Card>
//       )}
//     </>
//   );
// }

// export function JobCode({ operationId, description }) {
//   const { data: descList } = useGet(
//     `${endpoint}/operation_code/?operation=${operationId}`
//   );
//   const desc = descList && descList.filter((desc) => desc.name === description);
//   const jobNumber = desc && desc[0] && desc[0].operation_code;
//   return <>{jobNumber}</>;
// }

// export function ExpandingName({
//   operationId,
//   operationListId,
//   item,
//   setSelectedDesc,
// }) {
//   const { data: descList } = useGet(
//     `${endpoint}/operation_code/?operation=${operationId}`
//   );

//   const handleSelectDesc = (value) => {
//     axios
//       .patch(
//         `${endpoint}/operation_list/${operationListId}`,
//         { expanding_field: value.id },
//         { headers: headers }
//       )
//       .then(setSelectedDesc(value.name))
//       .catch((error) => console.error("Error updating operation:", error));
//   };

//   return (
//     <Menu>
//       {({ isOpen }) => (
//         <>
//           <MenuButton
//             isActive={isOpen}
//             as={Button}
//             rightIcon={<FaChevronDown />}
//           >
//             {item.expanding_field && item.expanding_field.name
//               ? item.expanding_field.name
//               : "N/A"}
//           </MenuButton>
//           <MenuList>
//             <MenuOptionGroup
//               type="radio"
//               onChange={(value) => {
//                 handleSelectDesc(value);
//               }}
//             >
//               {descList.map((desc) => (
//                 <MenuItemOption key={desc.id} value={desc}>
//                   {desc.name}
//                 </MenuItemOption>
//               ))}
//             </MenuOptionGroup>
//           </MenuList>
//         </>
//       )}
//     </Menu>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Dropdown from 'react-bootstrap/Dropdown';
import endpoint from "../utils/endpoint";

export default function OperationList({ bundleGroup, listId, operationListProp }) {
  const [operationList, setOperationList] = useState([]);
  const [operationCodes, setOperationCodes] = useState({});
  const [selectedCodes, setSelectedCodes] = useState({});
  const [operations, setOperations] = useState(operationListProp)
  const [deleteError, setDeleteError] = useState(null)

  useEffect(() => {
    setOperations(operationListProp);
  }, [operationListProp]);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const operationsResponse = await axios.get(`${endpoint}/operation_list/`, {
          params: { bundle_group: bundleGroup, listId: listId },
          headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
        });
        setOperationList(operationsResponse.data);
        operationsResponse.data.forEach(operation => {
          fetchOperationCodes(operation.operations.id)

          if (operation.expanding_field) {
            setSelectedCodes(prev => ({ ...prev, [operation.id]: operation.expanding_field }));
          }
        });
      } catch (error) {
        console.error("Error fetching operations:", error);
      }
    };
    fetchOperations();
  }, [bundleGroup, listId]);

  const fetchOperationCodes = async (operationId) => {
    try {
      const response = await axios.get(`${endpoint}/operation_code/?operation=${operationId}`, {
        headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` },
      });
      const codes = response.data;
      setOperationCodes(prev => ({ ...prev, [operationId]: codes }));

      const autoSelectedCode = codes.find(code => code.name === "");
      if (autoSelectedCode) {
        setSelectedCodes(prev => ({ ...prev, [operationId]: autoSelectedCode }));
      }
    } catch (error) {
      console.error(`Error fetching operation codes for operation ${operationId}:`, error);
    }
  };


  const handleSelectOperationCode = async (operationListId, operationId, codeId) => {
    const selectedCode = operationCodes[operationId].find(code => code.id.toString() === codeId);
    setSelectedCodes(prev => ({ ...prev, [operationListId]: selectedCode }));

    try {
      await axios.patch(`${endpoint}/operation_list/${operationListId}`, 
        { expanding_field: selectedCode.id },
        { headers: { Authorization: `JWT ${localStorage.getItem("access_token")}` } }
      );
    } catch (error) {
      console.error("Error saving operation code:", error);
    }
  };

  const handleDelete = async (operationListId) => {
    try {
      await axios.delete(`${endpoint}/operation_list/${operationListId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      
      setOperationList(prevOperationList => prevOperationList.filter(item => item.id !== operationListId));
      
      setDeleteError(null)

      console.log("Operation deleted successfully");
    } catch (error) {

    if (error.response && error.response.status === 400) {
      setDeleteError(error.response.data.error || 'An error occurred while deleting the operation.');
    } else {
      setDeleteError('An unexpected error occurred.');
    }
    }
  };

   const showDropdown = Object.values(operationCodes).flat().some(code => code.name && code.name.trim() !== "");

   return (
     <Card>
       <Card.Header><Card.Title>Operation List</Card.Title></Card.Header>
       
       <Card.Body>
       {deleteError && <div className="alert alert-danger" role="alert">{deleteError}</div>}
         <Table striped hover>
          
           <thead>
             <tr>
               <th>#</th>
               <th>Name</th>
               {showDropdown && <th>Select Concat field</th>} 
               <th>Code</th>
               <th>Delete</th>
             </tr>
           </thead>
           <tbody>
             {operationList.map((operation, index) => (
               <tr key={operation.id}>
                 <td>{index + 1}</td>
                 <td>{operation.operations.name || 'N/A'}</td>
                 {showDropdown && operationCodes[operation.operations.id]?.some(code => code.name && code.name.trim() !== "") ? (
                   <td style={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                     <Dropdown onSelect={(eventKey) => handleSelectOperationCode(operation.id, operation.operations.id, eventKey)}>
                       <Dropdown.Toggle
                         variant="success"
                         id={`dropdown-basic-${operation.id}`}
                         style={{ width: '100%', whiteSpace: 'normal' }}
                       >
                         {selectedCodes[operation.id] && selectedCodes[operation.id].name ? selectedCodes[operation.id].name : 'Select'}
                       </Dropdown.Toggle>
                       <Dropdown.Menu style={{ width: '100%' }}>
                        {operationCodes[operation.operations.id]?.map((code) => (
                          <Dropdown.Item 
                            key={code.id} 
                            eventKey={code.id.toString()} 
                            style={{ 
                              whiteSpace: 'normal', 
                              overflow: 'hidden',  
                              textOverflow: 'ellipsis' 
                            }}>
                            {code.name || `Code: ${code.operation_code}`}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                     </Dropdown>
                   </td>
                 ) : (
                   <td>
                     {operationCodes[operation.operations.id]?.[0]?.operation_code || 'Not Available'}
                   </td>
                 )}
                  {operationCodes[operation.operations.id]?.some(code => code.name.trim() !== "") && (
                  <td>
                    {selectedCodes[operation.id]?.operation_code || 'Not Selected'}
                  </td>
                )}
                 <td>
                   <Button className="btn-danger" onClick={() => handleDelete(operation.id)}>Delete</Button>
                 </td>
               </tr>
             ))}
           </tbody>
         </Table>
       </Card.Body>
     </Card>
   );
 }
 
