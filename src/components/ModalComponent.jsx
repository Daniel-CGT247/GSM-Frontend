import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import VarDropDown from "./VarDropDown";

export default function ModalComponent({ variables }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelect = (option) => {
    console.log(option);
  };

  return (
    <>
      <Button disabled={variables.length===0} variant="primary" onClick={handleShow}>
        Var
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unique Variables</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {variables.map((variable, index) => (
            <div key={index}>
              <strong>{variable.name}</strong>
              <div><VarDropDown options={variable.options} onSelect={handleSelect}/></div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
