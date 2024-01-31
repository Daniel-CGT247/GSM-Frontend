import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import endpoint from "../utils/endpoint";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
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
      const response = await axios.post(`${endpoint}/auth/users`, formData);
      setErrors({});
      navigate("/login");
    } catch (error) {
      if (
        error.response.data.detail ===
        "Authentication credentials were not provided."
      ) {
        console.log(error.response.data.detail);
        setErrors({});
        navigate("/login");
      } else {
        setErrors(error.response.data);
        console.log(error.response.data);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
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
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
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
      <Button variant="primary" className="w-full" type="submit">
        Register
      </Button>
      <hr />
      <footer>
        Already have an account?
        <span>
          <Link className="no-underline ml-2" to="/login">
            Sign In
          </Link>
        </span>
      </footer>
    </Form>
  );
}
