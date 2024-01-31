import { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import userAuth from "../customed_hook/useAuth";

export default function Navigation() {
  const user = userAuth();

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <>
      <Navbar sticky="top" bg="dark" variant="dark" className="py-2 px-4">
        <Navbar.Brand href="/collection">GSM Project</Navbar.Brand>
        {isAuth && (
          <div className="w-full flex justify-between items-center">
            <Nav>
              <Nav.Link href="/collection">Collection</Nav.Link>
              <Nav.Link href="/new-item">Build New Item</Nav.Link>
              <Nav.Link href="/Logout">Logout</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="text-lg font-semibold">
                {user?.username}
              </Navbar.Text>
            </Nav>
          </div>
        )}
      </Navbar>
    </>
  );
}
