import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

export default function EditModal({ itemData, onSave, onClose }) {
  const [styleNumber, setStyleNumber] = useState(itemData.styleNumber || '');
  const [season, setSeason] = useState(itemData.season || '');
  const [prototype, setPrototype] = useState(itemData.prototype || '');

  const handleSubmit = () => {
    console.log({ styleNumber, season, prototype });
    onSave({ ...itemData, styleNumber, season, prototype });
  };

  console.log(itemData); 

  
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Style Number</FormLabel>
            <Input value={styleNumber} onChange={(e) => setStyleNumber(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Season</FormLabel>
            <Input value={season} onChange={(e) => setSeason(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Prototype</FormLabel>
            <Input value={prototype} onChange={(e) => setPrototype(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

