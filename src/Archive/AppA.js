import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/NavBar";
import BlankPage from "./pages/BlankPage";
import Element from "./pages/Element";
import NewItem from "./pages/NewItem";
import Operation from "./pages/Operation";
import YourList from "./pages/YourList";

export default function App() {
  return (
    <>
      <Navigation />
      <Router>
        <Routes>
          <Route path="/" element={<BlankPage />} />
          {/* <Route path="/" element={<Collection />} /> */}
          <Route path="/new-item" element={<NewItem />} />
          <Route
            path="/:listId/job_group/:jobId/:bundleId/operation"
            element={<Operation />}
          />
          <Route
            path="/:listId/job_group/:jobId/:bundleId/your_list"
            element={<YourList />}
          />
          <Route
            path="/:listId/operation/:operationId/:operationListId/element"
            element={<Element />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}
