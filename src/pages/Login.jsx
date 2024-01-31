import Card from "react-bootstrap/Card";
import LoginForm from "../components/LoginForm";
import canadaGooseHeaderImage from "../images/canada-goose-header.jpg"; 

const Login = () => {
  return (
    <div className="flex my-5 justify-center items-center">
      <Card style={{ width: "30rem" }}>
        <Card.Img variant="top" src={canadaGooseHeaderImage} />
        <Card.Body>
          <Card.Title>Login</Card.Title>
          <Card.Text className="text-slate-500">
            Login to view your dashboard and much more!
          </Card.Text>
        </Card.Body>

        <Card.Body>
          <LoginForm />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
