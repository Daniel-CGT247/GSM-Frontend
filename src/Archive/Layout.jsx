import { Grid, GridItem } from "@chakra-ui/react";

export default function Layout({ children }) {
  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"`}
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" bg="orange.300" area={"header"}>
        <Header />
      </GridItem>
      <GridItem pl="2" bg="pink.300" area={"nav"}>
        <NavBar />
      </GridItem>
      <GridItem pl="2" bg="green.300" area={"main"}>
        {children}
      </GridItem>
    </Grid>
  );
}
