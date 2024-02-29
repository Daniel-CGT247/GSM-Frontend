import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGet from "../customed_hook/useGet";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import {
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { Badge } from "react-bootstrap";
import endpoint from "../utils/endpoint";

const ElementLibList = () => {
  const [elementLibList, setElementLibList] = useState([]); // list of elements
  const [selectedElements, setSelectedElements] = useState([]); // selected elements
  const [expandingNamesList, setExpandingNamesList] = useState([]); // concat input
  const { listId, operationId, operationListId } = useParams(); // extracts url param
  const styleNum = useGet(`${endpoint}/collection/${listId}`);
  const itemName = styleNum && styleNum.item && styleNum.item.name;
  const [elementList, setElementList] = useState([]);
  const [totalSam, setTotalSam] = useState("Loading..."); // calculate total time
  const navigate = useNavigate();

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
  const currentItems = filteredElements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const renderPaginationItems = (totalItems, itemsPerPage) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
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
    return pageNumbers;
  };

  const [currentOperation, setCurrentOperation] = useState(null);
  useEffect(() => {
    axios
      .get(`${endpoint}/operation_lib/${operationId}`, {
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
    axios
      .get(`${endpoint}/element_list/`, {
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
          `${endpoint}/element_list/`,
          {
            params: { operationList: operationListId },
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const uniqueExpandingNames = [
          ...new Set(
            elementListResponse.data.map((item) => item.expanding_name)
          ),
        ];
        setExpandingNamesList(
          uniqueExpandingNames.filter((name) => name !== null)
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
          axios.get(`${endpoint}/element_lib/`, {
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
    userExpandingName
  ) => {
    const selectedElement = elementLibList.find(
      (element) => element.id === elementId
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
        10
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
        `${endpoint}/element_list/`,
        postData,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const addedElement = {
        ...newElement,
        uniqueId: addResponse.data.id || uniqueId,
      };

      setSelectedElements((prevElements) => [...prevElements, addedElement]);

      const response = await axios.get(`${endpoint}/element_list/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      });
      const fetchedElement = response.data.find(
        (item) => item.id === addedElement.uniqueId
      );

      const fetchedTime = fetchedElement
        ? (parseFloat(fetchedElement.nmt) || 0).toFixed(4)
        : "N/A";

      setSelectedElements((prevElements) =>
        prevElements.map((el) =>
          el.uniqueId === addedElement.uniqueId
            ? { ...el, time: fetchedTime }
            : el
        )
      );
    } catch (error) {
      console.error("Error in adding element", error);

      setSelectedElements((prevElements) =>
        prevElements.map((el) =>
          el.uniqueId === newElement.uniqueId
            ? { ...el, time: "Error fetching time" }
            : el
        )
      );
    }
  };

  const fetchExpandingNameForElement = async (elementName, selectedOptions) => {
    if (elementList.length === 0) {
      return "N/A";
    }

    try {
      const matchingElement = elementList.find(
        (element) => element.elements.name === elementName
      );

      if (!matchingElement) {
        return "N/A";
      }

      const matchingOptionsElement = matchingElement.options.find((element) => {
        const elementOptionNames = element.variables.map(
          (variable) =>
            selectedOptions[`${matchingElement.id}_${variable.name}`]
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
        (element) => element.elements.name === elementName
      );

      if (!matchingElement) {
        return "N/A";
      }

      const matchingOptionsElement = matchingElement.options.find((element) => {
        const elementOptionNames = element.variables.map(
          (variable) =>
            selectedOptions[`${matchingElement.id}_${variable.name}`]
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
      .delete(`${endpoint}/element_list/${uniqueId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log("Element deleted successfully:", response.data);

        const updatedElements = selectedElements.filter(
          (element) => element.uniqueId !== uniqueId
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
      selectedVariables.hasOwnProperty(`${elementId}_${variable.name}`)
    );
  };

  const handleExpandingNameChange = (uniqueId, expandingName) => {
    const updatedSelectedElements = selectedElements.map((element) =>
      element.uniqueId === uniqueId ? { ...element, expandingName } : element
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
        (element) => element.uniqueId === uniqueId
      );

      if (!selectedElement) {
        console.error(`Element with uniqueId ${uniqueId} not found.`);
        return;
      }

      try {
        const response = await axios.patch(
          `${endpoint}/element_list/${selectedElement.uniqueId}/`,
          {
            expanding_name: newExpandingName,
          },
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("access_token")}`,
            },
          }
        );

        console.log("Expanding name added successfully:", response.data);
      } catch (error) {
        console.error("Error adding expanding name:", error);
      }
    }
  };

  const [visibleOptions, setVisibleOptions] = useState({});

  const toggleOptionsVisibility = (elementId) => {
    setVisibleOptions((prevVisibleOptions) => ({
      ...prevVisibleOptions,
      [elementId]: !prevVisibleOptions[elementId],
    }));
  };

  return (
    <Container fluid="lg" className="pt-5">
      <Row>
        <Col>
          <h2 className="font-bold text-center">{title}</h2>
          <h3 className="font-bold text-center">Style {itemName}</h3>
        </Col>

        <Row className="mt-4 d-flex justify-content-center">
          <Col xs="auto">
            <Button variant="success" onClick={() => navigate(-1)}>
              Complete
            </Button>
          </Col>
        </Row>
      </Row>
      <Row>
        <InputGroup className="mb-6">
          <FormControl
            placeholder="Search Elements..."
            value={searchFilter}
            onChange={handleSearchChange}
          />
        </InputGroup>

        <Col md={6}>
          <Card>
            <Card.Header>Element Library</Card.Header>
            <Card.Body
              style={{
                maxHeight: "550px",
                overflowY: "auto",
                minHeight: "550px",
              }}
            >
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>#</th>
                    <th style={{ width: "30%" }}>Element Name</th>
                    <th style={{ width: "45%" }}>Options</th>
                    <th style={{ width: "10%" }}>Add</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((elementLib, index) => (
                    <tr key={elementLib.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{elementLib.name}</td>
                      <td>
                        {elementLib.variables.length > 0 ? (
                          <Button
                            variant="link"
                            onClick={() =>
                              toggleOptionsVisibility(elementLib.id)
                            }
                            style={{ textDecoration: "none" }}
                          >
                            {visibleOptions[elementLib.id] ? (
                              <ChevronUp />
                            ) : (
                              <ChevronDown />
                            )}
                            {" Available"}
                            <Badge pill bg="info" text="light" className="ms-2">
                              {elementLib.variables.length}
                            </Badge>
                          </Button>
                        ) : (
                          "Not Available"
                        )}
                        {visibleOptions[elementLib.id] && (
                          <div>
                            {elementLib.variables.map((variable, index) => (
                              <div key={index} className="mb-2">
                                <label
                                  htmlFor={variable.name}
                                  className="form-label d-block"
                                >
                                  {variable.name}:
                                </label>
                                <select
                                  className="form-select"
                                  id={variable.name}
                                  onChange={(e) =>
                                    handleVariableChange(
                                      elementLib.id,
                                      variable.name,
                                      e.target.value
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
                                    )
                                  )}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={!areAllVariablesSelected(elementLib.id)}
                          onClick={() =>
                            handleAddElement(elementLib.id, selectedVariables)
                          }
                        >
                          Add
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <Pagination className="justify-content-center">
                {renderPaginationItems(filteredElements.length, itemsPerPage)}
              </Pagination>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Selected Elements</Card.Header>
            <Card.Body style={{ maxHeight: "580px", overflowY: "auto" }}>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Element Name</th>
                    <th>Expanding Field</th>
                    <th>Time</th>
                    <th>Selected Options</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedElements.map((element, index) => (
                    <tr key={element.uniqueId}>
                      <td>{index + 1}</td>
                      <td>{element.name}</td>

                      <td>
                        <div>
                          <select
                            className="form-select"
                            value={element.expandingName}
                            onChange={(e) =>
                              handleExpandingNameChange(
                                element.uniqueId,
                                e.target.value
                              )
                            }
                          >
                            <option value="N/A">N/A</option>
                            {expandingNamesList.map((expandingName) => (
                              <option key={expandingName} value={expandingName}>
                                {expandingName}
                              </option>
                            ))}
                            <option value="__ADD_NEW__">Add New...</option>
                          </select>
                        </div>

                        {element.expandingName === "__ADD_NEW__" && (
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
                                handleAddNewExpandingName(element.uniqueId)
                              }
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </td>

                      <td>
                        {element.time === undefined
                          ? "Loading..."
                          : element.time}
                      </td>

                      <td>
                        {Object.entries(element.selectedOptions).map(
                          ([variableName, optionName], index) => (
                            <div key={index}>
                              {variableName}: {optionName}
                            </div>
                          )
                        )}
                      </td>

                      <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteElement(element.uniqueId)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="text-right">
              <strong>Total SAM: {totalSam}</strong>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ElementLibList;
