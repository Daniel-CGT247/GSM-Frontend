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
          fetchOperationCodes(operation.operations.id);

          if (operation.expanding_field) {
            setSelectedCodes(prev => ({ ...prev, [operation.id]: operation.expanding_field }))
          }
        })
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

      const codes = response.data
      setOperationCodes(prev => ({ ...prev, [operationId]: codes }))


      const autoSelectedCode = codes.find(code => code.name === "")
      if (autoSelectedCode) {
        setSelectedCodes(prev => ({ ...prev, [operationId]: autoSelectedCode }));
      }
    } catch (error) {
      console.error(`Error fetching op code ${operationId}:`, error);
    }
  };
  

  const handleSelectOperationCode = async (operationListId, operationId, codeId) => {
    const selectedCode = operationCodes[operationId].find(code => code.id.toString() === codeId)
    setSelectedCodes(prev => ({ ...prev, [operationListId]: selectedCode }))

 
    try {
      await axios.patch(`${endpoint}/operation_list/${operationListId}`, 
        { 
          expanding_field: selectedCode.id 
        },
        { headers: { 
          Authorization: `JWT ${localStorage.getItem("access_token")}` } 
        }
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
      setDeleteError(error.response.data.error || 'err while deleting operation');
    } else {
      setDeleteError('unexpected err');
    }
    }
  };


   const showDropdown = Object.values(operationCodes).flat().some(code => code.name && code.name.trim() !== "")

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
                              whiteSpace: 'normal',  // wrap the text 
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
 
