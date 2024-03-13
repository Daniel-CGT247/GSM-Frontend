import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  Image,
  Text,
  useToast,
  FormErrorMessage,
  Container,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { MdDescription, MdDateRange, MdStyle } from 'react-icons/md';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGet from '../customed_hook/useGet';
import useHeaders from '../customed_hook/useHeader';
import endpoint from '../utils/endpoint';


export default function NewItemForm({ username }) {
  const { data: user } = useGet(`${endpoint}/user/`, 
  { username: username }
);
const headers = useHeaders();
const [formData, setFormData] = useState({
  item: {
    name: "",
    description: "",
    season: "",
    image: "",
    proto: null,
  },
  complete: false,
  created_by: user?.id,
});

useEffect(() => {
  if (user) {
    setFormData((prevData) => ({
      ...prevData,
      created_by: user[0]?.id,
    }));
  }
}, [user]);

console.log(formData);
const [imagePreview, setImagePreview] = useState(null);
const [errors, setErrors] = useState({});
const navigate = useNavigate();
const toast = useToast();

const handleChange = (e) => {
  const { name, value, type, files } = e.target;

  if (type === "file") {
    setFormData((prevData) => ({
      ...prevData,
      item: {
        ...prevData.item,
        [name]: files[0],
      },
    }));
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setImagePreview(fileReader.result);
    };
    fileReader.readAsDataURL(files[0]);
  } else {
    setFormData((prevData) => ({
      ...prevData,
      item: {
        ...prevData.item,
        [name]: value,
      },
    }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();

  Object.keys(formData.item).forEach(key => {
    if (key !== 'image') {
      formDataToSend.append(`item.${key}`, formData.item[key]);
    }
  });

  formDataToSend.append('complete', formData.complete);
  if (formData.created_by) formDataToSend.append('created_by', formData.created_by);

  if (formData.item.image) {
    formDataToSend.append('image', formData.item.image);
  } 

  formDataToSend.append('proto', formData.item.proto);
  formDataToSend.append('complete', formData.complete);
  formDataToSend.append('created_by', formData.created_by);

  Object.keys(formData.item).forEach(key => {
    formDataToSend.append(`item.${key}`, formData.item[key]);
  });


  try {
    await axios.post(`${endpoint}/collection/`, formDataToSend, {
      headers: {
        'Authorization': headers.Authorization,
      },
    });
    setErrors({});
    navigate(`/`);
  } catch (error) {
    if (error.response && error.response.data) {
      setErrors(error.response.data);
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
};
  
  return (
    <Container maxW="container.md"  p={4} bg="white" borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200">
      <VStack as="form" onSubmit={handleSubmit} spacing={5} align="stretch">
      {errors.duplicate && <Text color="red.500">{errors.duplicate}</Text>}

      <FormControl isInvalid={!!errors.item?.image}>
        <FormLabel>Image</FormLabel>
        <Input name="image" type="file" onChange={handleChange} />
        {imagePreview && (
          <Box mt={2}>
            <Image src={imagePreview} alt="Preview" maxWidth="100%" objectFit="cover" />
          </Box>
        )}
        <FormErrorMessage>{errors.item?.image}</FormErrorMessage>
      </FormControl>

        <FormControl isInvalid={!!errors.item?.name}>
        <FormLabel>Style Name</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdStyle} color="gray.500" />
            </InputLeftElement>
            <Input 
              name="name" 
              placeholder="Enter Your Style..." 
              autocomplete="off" 
              onChange={handleChange} 
              value={formData.item.name} 
            />
          </InputGroup>
          <FormErrorMessage>{errors.item?.name}</FormErrorMessage>
        </FormControl>

        <FormControl>
        <FormLabel>Description</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdDescription} color="gray.500" />
            </InputLeftElement>
            <Input 
              name="description" 
              placeholder="Enter Description..." 
              autocomplete="off" 
              onChange={handleChange} 
              value={formData.item.description} 
            />
          </InputGroup>
        </FormControl>

        <FormControl isInvalid={!!errors.item?.season}>
        <FormLabel>Season</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdDateRange} color="gray.500" />
            </InputLeftElement>
            <Input 
              name="season" 
              placeholder="Season (e.g., SP/FW2024)" 
              autocomplete="off" onChange={handleChange} 
              value={formData.item.season} 
            />
          </InputGroup>
          <FormErrorMessage>{errors.item?.season}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.item?.proto}>
        <FormLabel>Prototype</FormLabel>
        <Input
          name="proto"
          type="number"
          placeholder="Enter Proto..."
          autocomplete="off" 
          onChange={handleChange}
          value={formData.item.proto}
        />
        <FormErrorMessage>{errors.item?.proto}</FormErrorMessage>
      </FormControl>
        <Button colorScheme="twitter" size="lg" fontSize="md" boxShadow="sm" borderRadius="full" type="submit">
          Submit
        </Button>
      </VStack>
    </Container>
  );
}
