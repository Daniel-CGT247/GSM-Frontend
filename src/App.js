import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Container, Heading, Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navigation from "./components/NavBar";
import Collection from "./pages/Collection";
import ElementPage from "./pages/ElementPage";
import JobGroup from "./pages/JobGroup";
import NewItem from "./pages/NewItem";
import Operation from "./pages/Operation";
import YourList from "./pages/YourList";
import SidePannel from "./components/SidePannel";
import Support from "./pages/Support";
import { useState } from "react";

export default function App({ pca }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <MsalProvider instance={pca}>
      <UnauthenticatedTemplate>
        <>
          <Navigation
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Container centerContent>
            <Heading mt={35} as="h3" size="lg">
              Please sign in first to view
            </Heading>
          </Container>
        </>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Grid
          templateAreas={`"header header"
                  "nav main"`}
          templateColumns={isSidebarOpen ? `250px 1fr` : `50px 1fr`}
        >
          <GridItem area="header" position="sticky" top={0} zIndex={9}>
            <Navigation
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </GridItem>
          <GridItem area={"nav"} position="fixed">
            <SidePannel isOpen={isSidebarOpen} />
          </GridItem>
          <GridItem area={"main"}>
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
                  element={<ElementPage />}
                />
                <Route
                  path="/support"
                  element={<Support />}
                />
              </Routes>
            </Router>
          </GridItem>
        </Grid>
      </AuthenticatedTemplate>
    </MsalProvider>
  );
}
