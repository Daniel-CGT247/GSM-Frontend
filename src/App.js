import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Container, Heading } from "@chakra-ui/react";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/NavBar";
import Collection from "./pages/Collection";
import Element from "./pages/Element";
import NewItem from "./pages/NewItem";
import Operation from "./pages/Operation";
import YourList from "./pages/YourList";
import JobGroup from "./pages/JobGroup";

export default function App({ pca }) {
  return (
    <MsalProvider instance={pca}>
      <Navigation />
      <UnauthenticatedTemplate>
        <Container centerContent>
          <Heading mt={35} as="h3" size="lg">
            Please sign in first to view
          </Heading>
        </Container>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Router>
          <Routes>
            <Route path="/" element={<Collection />} />
            <Route path="/new-item" element={<NewItem />} />
            <Route
              path="/:listId/job_group/:jobId/:bundleId/operation"
              element={<Operation />}
            />
            <Route path=":listId/job_group" element={<JobGroup />} />
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
      </AuthenticatedTemplate>
    </MsalProvider>
  );
}
