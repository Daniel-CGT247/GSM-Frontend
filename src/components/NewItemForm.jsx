import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDateRange, MdDescription } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useGet from "../customed_hook/useGet";
import useHeaders from "../customed_hook/useHeader";
import endpoint from "../utils/endpoint";

export default function NewItemForm({ username }) {
  const { data: user } = useGet(`${endpoint}/user/`, { username: username });
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

  const validateInput = (name, value) => {
    const itemNamePattern = /^\d{4}[A-Z]{1,7}$/;
    const seasonPattern = /^(SP|FW)\d{4}$/;
    let newErrors = { ...errors };

    // validate name
    if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Style name is required.";
      } else if (!itemNamePattern.test(value.trim())) {
        newErrors.name =
          "Item name must start with 4 digits followed by 1-7 upper case letters.";
      } else {
        delete newErrors.name;
      }
    }
    // validate season
    else if (name === "season") {
      if (!value.trim()) {
        newErrors.season = "Season is required.";
      } else if (!seasonPattern.test(value.trim())) {
        newErrors.season =
          "Season must start with SP/FW followed by year (YYYY).";
      } else {
        delete newErrors.season;
      }
    }
    // validate proto
    else if (name === "proto") {
      if (!value.trim()) {
        newErrors.proto = "Prototype is required.";
      } else if (isNaN(value) || parseInt(value, 10) <= 0) {
        newErrors.proto = "Prototype must be a positive number.";
      } else {
        delete newErrors.proto;
      }
    }

    setErrors(newErrors);
  };

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
      validateInput(name, value);
      validateInput(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemNamePattern = /^\d{4}[A-Z]{1,7}$/;
    const seasonPattern = /^(SP|FW)\d{4}$/;

    let newErrors = {};
    //===================================
    // - validate the format
    //===================================
    // refStyle
    if (!formData.item.name.trim()) {
      newErrors.name = "Style name is required.";
    } else if (!itemNamePattern.test(formData.item.name.trim())) {
      newErrors.name =
        "Item name must start with 4 digits followed by 1-7 upper case letters.";
    }

    // season
    if (!formData.item.season.trim()) {
      newErrors.season = "Season is required.";
    } else if (!seasonPattern.test(formData.item.season.trim())) {
      newErrors.season =
        "Season must start with SP/FW followed by year (YYYY).";
    }

    // proto
    if (
      formData.item.proto === null ||
      formData.item.proto === undefined ||
      formData.item.proto === ""
    ) {
      newErrors.proto = "Prototype is required.";
    }
    setErrors(newErrors);

    // if no errors
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();

    Object.keys(formData.item).forEach((key) => {
      if (key !== "image") {
        formDataToSend.append(`item.${key}`, formData.item[key]);
      }
    });

    formDataToSend.append("complete", formData.complete);
    if (formData.created_by)
      formDataToSend.append("created_by", formData.created_by);

    if (formData.item.image) {
      formDataToSend.append("image", formData.item.image);
    }

    formDataToSend.append("proto", formData.item.proto);
    formDataToSend.append("complete", formData.complete);
    formDataToSend.append("created_by", formData.created_by);

    Object.keys(formData.item).forEach((key) => {
      formDataToSend.append(`item.${key}`, formData.item[key]);
    });

    try {
      await axios.post(`${endpoint}/collection/`, formDataToSend, {
        headers: {
          Authorization: headers.Authorization,
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
    <Container
      maxW="container.md"
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.200"
    >
      <VStack as="form" onSubmit={handleSubmit} spacing={5} align="stretch">
        {errors.duplicate && <Text color="red.500">{errors.duplicate}</Text>}

        <FormControl isInvalid={!!errors.item?.image}>
          <FormLabel>Image</FormLabel>
          <Input name="image" type="file" onChange={handleChange} />
          {imagePreview && (
            <Box mt={2}>
              <Image
                src={imagePreview}
                alt="Preview"
                maxWidth="100%"
                objectFit="cover"
              />
            </Box>
          )}
          <FormErrorMessage>{errors.item?.image}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Style Name</FormLabel>
          <Input
            name="name"
            placeholder="Enter Your Style..."
            autocomplete="off"
            onChange={handleChange}
            value={formData.item.name}
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
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

        <FormControl isInvalid={!!errors.season}>
          <FormLabel>Season</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdDateRange} color="gray.500" />
            </InputLeftElement>
            <Input
              name="season"
              placeholder="Season (e.g., SP/FW2024)"
              autocomplete="off"
              onChange={handleChange}
              value={formData.item.season}
            />
          </InputGroup>
          <FormErrorMessage>{errors.item?.season}</FormErrorMessage>
          {errors.season && (
            <FormErrorMessage>{errors.season}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.proto}>
          <FormLabel>Prototype</FormLabel>
          <Input
            name="proto"
            type="number"
            placeholder="Enter Proto..."
            autocomplete="off"
            onChange={handleChange}
            value={formData.item.proto}
          />
          {errors.proto && <FormErrorMessage>{errors.proto}</FormErrorMessage>}
        </FormControl>
        <Button
          colorScheme="twitter"
          size="lg"
          fontSize="md"
          boxShadow="sm"
          borderRadius="full"
          type="submit"
        >
          Submit
        </Button>
      </VStack>
    </Container>
  );
}
