import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGet from "../customed_hook/getData";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";

const ElementLibList = () => {
  const [elementLibList, setElementLibList] = useState([]); // list of elements
  const [selectedElements, setSelectedElements] = useState([]); // selected elements
  const [expandingNamesList, setExpandingNamesList] = useState([]); // concat input
  const { listId, operationId, operationListId } = useParams(); // extracts url param
  const styleNum = useGet(`http://127.0.0.1:8000/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;
  const [elementList, setElementList] = useState([]);
  const [totalSam, setTotalSam] = useState("Loading..."); // calculate total time

  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


    const handleSearchChange = (e) => {
      setSearchFilter(e.target.value);
      setCurrentPage(1); 
    };
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const filteredElements = elementLibList.filter((element) =>
      element.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredElements.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredElements.length / itemsPerPage); i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }



  const [currentOperation, setCurrentOperation] = useState(null);
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/operation_lib/${operationId}`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("access_token")}`,
      },
    })
    .then((response) => {
      setCurrentOperation(response.data);
    })
    .catch((error) => {
      console.error("Error fetching operation details:", error);
    });
  }, [operationId]);

  let title = "Build Elements";
  if (currentOperation) {
    title += ` - ${currentOperation.bundle_group} - ${currentOperation.name}`;
  }

  const scrollableTableStyle = {
    maxHeight: "580px", 
    overflowY: "auto",
  };

  const calculateTotalSam = () => {
    const totalTime = selectedElements.reduce((total, element) => {
      const elementTime = parseFloat(element.time) || 0;
      return total + elementTime;
    }, 0);

    return totalTime.toFixed(2);
  };

  useEffect(() => {
    const finalTotalTime = calculateTotalSam();
    setTotalSam(finalTotalTime);
  }, [selectedElements]);


  useEffect(() => {
    axios.get("http://127.0.0.1:8000/element_list/", {
        params: { operationList: operationListId },
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        const combinedData = response.data.map((item) => ({
          uniqueId: item.id,
          id: item.elements.id,
          name: item.elements.name,
          expandingName: item.expanding_name || "N/A",
          time: item.nmt ? parseFloat(item.nmt).toFixed(4) : "N/A",

          selectedOptions: item.options.reduce((acc, curr) => {
            acc[curr.name] = curr.name;
            return acc;
          }, {}),
        }));
        setSelectedElements(combinedData);
        localStorage.setItem("selectedElements", JSON.stringify(combinedData));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  useEffect(() => {
    const fetchExpandingNames = async () => {
      try {
        // get elements
        const elementListResponse = await axios.get(
          "http://127.0.0.1:8000/element_list/",
          {
            params: { operationList: operationListId },
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            },
          },
        );

        const uniqueExpandingNames = [
          ...new Set(
            elementListResponse.data.map((item) => item.expanding_name),
          ),
        ];
        setExpandingNamesList(
          uniqueExpandingNames.filter((name) => name !== null),
        );
      } catch (error) {
        console.error("Error fetching expanding names:", error);
      }
    };

    fetchExpandingNames();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elementLibResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/element_lib/", {
            params: { operation_id: operationId },
          }),
        ]);

        const updatedElementLibList = elementLibResponse.data.map((element) => {
          return {
            ...element,
            variables: element.variables.map((variable) => {
              return {
                ...variable,
                options: variable.options.map((option) => {
                  return {
                    id: option.id, 
                    name: option.name, 
                  };
                }),
              };
            }),
          };
        });

        setElementLibList(updatedElementLibList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const saveSelectedElementsToLocalStorage = (elements) => {
    localStorage.setItem("selectedElements", JSON.stringify(elements));
  };

 
  const handleAddElement = async (
    elementId,
    selectedOptions,
    userExpandingName,
  ) => {
    const selectedElement = elementLibList.find(
      (element) => element.id === elementId,
    );
    if (!selectedElement) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }

    const uniqueId = Date.now();  
    const newElement = {
      ...selectedElement,
      selectedOptions: {},
      uniqueId: uniqueId,
      time: "Fetching...",
      expandingName:
        userExpandingName || selectedElement.expandingName || "N/A",
    };

    selectedElement.variables.forEach((variable) => {
      const selectedOptionId = parseInt(
        selectedOptions[`${elementId}_${variable.name}`],
        10,
      );
      newElement.selectedOptions[variable.name] = selectedOptionId;
    });

    try {
      const postData = {
        listItem: operationListId,
        elements: newElement.id,
        expanding_name: newElement.expandingName, 
        options: Object.values(newElement.selectedOptions),
      };

      const addResponse = await axios.post(
        "http://127.0.0.1:8000/element_list/",
        postData,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const addedElement = {
        ...newElement,
        uniqueId: addResponse.data.id || uniqueId,
      };

      setSelectedElements((prevElements) => [...prevElements, addedElement]);


      const response = await axios.get(`http://127.0.0.1:8000/element_list/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      const fetchedElement = response.data.find(
        (item) => item.id === addedElement.uniqueId,
      );

      const fetchedTime = fetchedElement ? (parseFloat(fetchedElement.nmt) || 0).toFixed(4) : "N/A";

      setSelectedElements((prevElements) =>
        prevElements.map((el) =>
          el.uniqueId === addedElement.uniqueId
            ? { ...el, time: fetchedTime }
            : el,
        ),
      );
    } catch (error) {
      console.error("Error in adding element", error);

      setSelectedElements((prevElements) =>
        prevElements.map((el) =>
          el.uniqueId === newElement.uniqueId
            ? { ...el, time: "Error fetching time" }
            : el,
        ),
      );
    }
  };


  const fetchExpandingNameForElement = async (elementName, selectedOptions) => {
    if (elementList.length === 0) {
      return "N/A";
    }

    try {
      const matchingElement = elementList.find(
        (element) => element.elements.name === elementName,
      );

      if (!matchingElement) {
        return "N/A";
      }

      const matchingOptionsElement = matchingElement.options.find((element) => {
        const elementOptionNames = element.variables.map(
          (variable) =>
            selectedOptions[`${matchingElement.id}_${variable.name}`],
        );

        return (
          elementOptionNames.join(",") ===
          Object.values(selectedOptions).join(",")
        );
      });

      return matchingOptionsElement
        ? matchingOptionsElement.expanding_name || "N/A"
        : "N/A";
    } catch (error) {
      console.error("Error fetching expanding name for element:", error);
      return "N/A";
    }
  };


  const fetchTimeForElement = async (elementName, selectedOptions) => {
    if (elementList.length === 0) {
      return "N/A";
    }

    try {
      const matchingElement = elementList.find(
        (element) => element.elements.name === elementName,
      );

      if (!matchingElement) {
        return "N/A";
      }

      const matchingOptionsElement = matchingElement.options.find((element) => {
        const elementOptionNames = element.variables.map(
          (variable) =>
            selectedOptions[`${matchingElement.id}_${variable.name}`],
        );

        return (
          elementOptionNames.join(",") ===
          Object.values(selectedOptions).join(",")
        );
      });

      return matchingOptionsElement
        ? matchingOptionsElement.nmt || "N/A"
        : "N/A";
    } catch (error) {
      console.error("Error fetching time for element:", error);
      return "N/A";
    }
  };

  const handleDeleteElement = (uniqueId) => {
    axios
      .delete(`http://127.0.0.1:8000/element_list/${uniqueId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log("Element deleted successfully:", response.data);

        const updatedElements = selectedElements.filter(
          (element) => element.uniqueId !== uniqueId,
        );

        setSelectedElements(updatedElements);
        saveSelectedElementsToLocalStorage(updatedElements);
      })
      .catch((error) => {
        console.error("Error deleting element:", error);
      });
  };


  const [selectedVariables, setSelectedVariables] = useState({});
  const handleVariableChange = (elementId, variableName, selectedOptionId) => {
    setSelectedVariables((prevSelectedVariables) => ({
      ...prevSelectedVariables,
      [`${elementId}_${variableName}`]: selectedOptionId,
    }));
  };


  const areAllVariablesSelected = (elementId) => {
    const elementVariables =
      elementLibList.find((element) => element.id === elementId)?.variables ||
      [];
    return elementVariables.every((variable) =>
      selectedVariables.hasOwnProperty(`${elementId}_${variable.name}`),
    );
  };


  const handleExpandingNameChange = (uniqueId, expandingName) => {
    const updatedSelectedElements = selectedElements.map((element) =>
      element.uniqueId === uniqueId ? { ...element, expandingName } : element,
    );

    setSelectedElements(updatedSelectedElements);
    saveSelectedElementsToLocalStorage(updatedSelectedElements);
  };


  const [newExpandingName, setNewExpandingName] = useState(""); 
  const handleAddNewExpandingName = async (uniqueId) => {
    if (newExpandingName.trim() !== "") {
 
      setExpandingNamesList((prevList) => [...prevList, newExpandingName]);
      setNewExpandingName(""); 

      const selectedElement = selectedElements.find(
        (element) => element.uniqueId === uniqueId,
      );

      if (!selectedElement) {
        console.error(`Element with uniqueId ${uniqueId} not found.`);
        return;
      }

      try {
        const response = await axios.patch(
          `http://127.0.0.1:8000/element_list/${selectedElement.uniqueId}/`,
          {
            expanding_name: newExpandingName,
          },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            },
          },
        );

        console.log("Expanding name added successfully:", response.data);
      } catch (error) {
        console.error("Error adding expanding name:", error);
      }
    }
  };
  
  return (
    <div className="container p-5" style={{ fontFamily: "Arial, sans-serif" }}>
      <h2 className="font-bold text-center">{title}</h2>
      <h3 className="font-bold text-center">Style {itemName}</h3>

         <div className="row my-2">
        {/* Element Library Section */}
        <div className="col-md-6">
          <Card>
            <Card.Header>
              <h5 className="card-title">Element Library</h5>
              <Form.Control
                type="text"
                placeholder="Search Elements..."
                value={searchFilter}
                onChange={handleSearchChange}
                style={{ width: '300px', marginBottom: '10px' }}
              />
            </Card.Header>
            <Card.Body>
              <div style={scrollableTableStyle}>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Element Name</th>
                      <th>Variable</th>
                      <th>Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((elementLib, index) => (
                      <tr key={elementLib.id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{elementLib.name}</td>
                        <td>
                          {elementLib.variables.length > 0 ? (
                            <div>
                              {elementLib.variables.map((variable, index) => (
                                <div key={index}>
                                  <label htmlFor={variable.name}>
                                    {variable.name}:
                                  </label>
                                  <select
                                    className="form-select"
                                    id={variable.name}
                                    onChange={(e) =>
                                      handleVariableChange(
                                        elementLib.id,
                                        variable.name,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      selectedVariables[
                                        `${elementLib.id}_${variable.name}`
                                      ] || ""
                                    }
                                  >
  
                                    <option value="">Select an option</option>
                                    {variable.options.map(
                                      (option, optionIndex) => (
                                        <option
                                          key={optionIndex}
                                          value={option.id}
                                        >
                                          {option.name}
                                        </option>
                                      ),
                                    )}
                                  </select>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span>Not Available</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            disabled={!areAllVariablesSelected(elementLib.id)}
                            onClick={() =>
                              handleAddElement(elementLib.id, selectedVariables)
                            }
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>{pageNumbers}</Pagination>
              </div>
            </Card.Body>
          </Card>
        </div>
  
        <div className="col-md-6">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title>Element List</Card.Title>
                <div className="text-right">
                  <strong>Total SAM: {totalSam}</strong>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={scrollableTableStyle}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {/* <th>ID</th> */}
                      <th>Element Name</th>
                      <th>Expanding Field</th>
                      <th>Time</th>
                      <th>Selected Options</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedElements.map((selectedElement, index) => (
                      <tr key={selectedElement.uniqueId}>
                        <td>{index + 1}</td>
                        {/* <td>{selectedElement.id}</td> */}
                        <td>{selectedElement.name}</td>

                        <td>


                          <div>
                            <select
                              className="form-select"
                              value={selectedElement.expandingName}
                              onChange={(e) =>
                                handleExpandingNameChange(
                                  selectedElement.uniqueId,
                                  e.target.value,
                                )
                              }
                            >
                              <option value="N/A">N/A</option>
                              {expandingNamesList.map((expandingName) => (
                                <option
                                  key={expandingName}
                                  value={expandingName}
                                >
                                  {expandingName}
                                </option>
                              ))}
                              <option value="__ADD_NEW__">Add New...</option>
                            </select>
                          </div>
                          {selectedElement.expandingName === "__ADD_NEW__" && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={newExpandingName}
                                onChange={(e) =>
                                  setNewExpandingName(e.target.value)
                                }
                                placeholder="Enter new option..."
                              />
                              <button
                                className="btn btn-primary ms-2"
                                onClick={() =>
                                  handleAddNewExpandingName(
                                    selectedElement.uniqueId,
                                  )
                                }
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </td>

                        <td>
                          {selectedElement.time === undefined
                            ? "Loading..."
                            : selectedElement.time}
                        </td>

                        <td>
                          {Object.entries(selectedElement.selectedOptions).map(
                            ([variableName, optionName], index) => (
                              <div key={index}>
                                {variableName}: {optionName}
                              </div>
                            ),
                          )}
                        </td>

                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleDeleteElement(selectedElement.uniqueId)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );

};

export default ElementLibList;
