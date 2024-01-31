import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import useAuth from "../customed_hook/useAuth";
import endpoint from "../utils/endpoint";

export default function NewItemForm() {
  const user = useAuth();

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prepare FormData - file uploads
    const formDataToSend = new FormData();

    // append item properties to the FormData
    Object.keys(formData.item).forEach((key) => {
      formDataToSend.append(`item.${key}`, formData.item[key]);
    });

    formDataToSend.append("complete", formData.complete);
    formDataToSend.append("created_by", formData.created_by);

    const headers = {
      Authorization: `JWT ${localStorage.getItem("access_token")}`,
    };

    try {
      await axios.post(`${endpoint}/collection/`, formDataToSend, { headers });
      setErrors({});
      navigate(`/collection`);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {errors.duplicate && (
          <div className="alert alert-danger" role="alert">
            {errors.duplicate}
          </div>
        )}

        <Form.Label>Image</Form.Label>
        <Form.Control name="image" type="file" onChange={handleChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Style Number</Form.Label>
        <Form.Control
          name="name"
          type="text"
          autoComplete="off"
          required
          placeholder="Enter Your Style..."
          value={formData.item.name}
          onChange={handleChange}
          isInvalid={!!errors.item?.name}
        />
        {errors.item && errors.item.name && (
          <Form.Text className="text-danger">{errors.item.name}</Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          name="description"
          type="text"
          autoComplete="off"
          required
          placeholder="Enter Description..."
          value={formData.item.description}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.item && errors.item.description && (
        <Form.Text className="text-danger">{errors.item.description}</Form.Text>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Season</Form.Label>
        <Form.Control
          name="season"
          type="text"
          autoComplete="off"
          required
          placeholder="Example: SP/FW2024"
          value={formData.item.season}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.item && errors.item.season && (
        <Form.Text className="text-danger">{errors.item.season}</Form.Text>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Proto</Form.Label>
        <Form.Control
          name="proto"
          type="number"
          autoComplete="off"
          required
          placeholder="Enter Proto..."
          value={formData.item.proto}
          onChange={handleChange}
        />
      </Form.Group>
      {errors.item && errors.item.proto && (
        <Form.Text className="text-danger">{errors.item.proto}</Form.Text>
      )}

      <Button variant="primary" className="w-full" type="submit">
        Continue
      </Button>
    </Form>
  );
}
