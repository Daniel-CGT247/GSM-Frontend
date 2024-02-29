import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/NavBar";
import Collection from "./pages/Collection";
//import ElementPage from "./pages/ElementPage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NewItem from "./pages/NewItem";
import Operation from "./pages/Operation";
import Register from "./pages/Register";
import YourList from "./pages/YourList";
import JobGroup from "./pages/JobGroup";
import Element from "./pages/Element";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/new-item" element={<NewItem />} />
          <Route path="/:listId/job_group" element={<JobGroup />} />
          <Route
            path="/:listId/job_group/:jobId/:bundleId/operation"
            element={<Operation />}
          />
          <Route
            path="/:listId/job_group/:jobId/:bundleId/your_list"
            element={<YourList />}
          />
          {/* <Route
            path="/:listId/operation/:operationId/:operationListId/element"
            element={<ElementPage />}
          ></Route>  */}
          
          <Route
            path="/:listId/operation/:operationId/:operationListId/element"
            element={<Element />}
          ></Route>

        </Routes>
      </Router>
    </div>
  );
}
