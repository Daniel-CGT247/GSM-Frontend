import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import endpoint from "../utils/endpoint";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${endpoint}/auth/jwt/create`,
        formData
      );
      setErrors({});
      localStorage.clear();
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      console.log("Login successful:", response.data.access);
      navigate("/collection");
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      }
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && (
          <Form.Text className="text-danger">{errors.username}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <Form.Text className="text-danger">{errors.password}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        {errors.detail && (
          <Form.Text className="text-danger">{errors.detail}</Form.Text>
        )}
      </Form.Group>
      <Button variant="primary" className="w-full" type="submit">
        Login
      </Button>
      <hr />
      <footer>
        Don't have account yet?
        <span>
          <Link className="no-underline ml-2" to="/register">
            Register
          </Link>
        </span>
      </footer>
    </Form>
  );
}
