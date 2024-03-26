import React, { useState } from 'react';
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from '@chakra-ui/react';

const Support = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting support request:', { email, message });

    setEmail('');
    setMessage('');
  };

  return (
    <Container centerContent p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            placeholder='pusingh@canadagoose.com'
            onChange={(e) => setEmail(e.target.value)}
            width="300px"
          />
        </FormControl>
        <FormControl mt={4} isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}

          />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Support;
