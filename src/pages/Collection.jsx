import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import CardSkeleton from "../components/CardSkeleton";
import CarouselCollection from "../components/Carousel";
import CollectionCard from "../components/CollectionCard";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

export default function Collection() {
  const { data: fetchedData, isLoading } = useGet(`${endpoint}/collection/`);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedProto, setSelectedProto] = useState("");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSeason("");
    setSelectedProto("");
  };

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  const filteredData = data.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSeason === "" || item.item.season === selectedSeason) &&
      (selectedProto === "" || item.item.proto === parseInt(selectedProto))
  );

  const uniqueSeasons = [
    ...new Set(data.map((item) => item.item.season)),
  ].sort();

  const uniquePrototype = [
    ...new Set(data.map((item) => item.item.proto)),
  ].sort();

  const updateItemInData = (updatedItem) => {
    const newData = data.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setData(newData);
  };

  return (
    <Container maxW="8xl" py={8}>
      <Box
        w="full"
        bgColor="white"
        p="6"
        shadow="md"
        rounded="lg"
        position="sticky"
        top="50px"
        zIndex={10}
      >
        <Flex alignItems="center" my={0} justifyContent="space-between" gap={4}>
          <Heading size="lg">Collection</Heading>
          <InputGroup maxWidth="50%">
            <InputLeftElement pointerEvents="none">
              <IoSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search a Style"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="filled"
              focusBorderColor="blue.500"
            />
            {searchTerm && (
              <InputRightElement>
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  variant="ghost"
                />
              </InputRightElement>
            )}
          </InputGroup>
          <Flex alignItems="center" gap="2">
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={<FaChevronDown />}
                  >
                    {!selectedSeason ? "Season" : selectedSeason}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup
                      type="radio"
                      onChange={(value) => setSelectedSeason(value)}
                    >
                      <MenuItemOption value="">All</MenuItemOption>
                      {uniqueSeasons.map((season) => (
                        <MenuItemOption key={season} value={season}>
                          {season}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </>
              )}
            </Menu>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={<FaChevronDown />}
                  >
                    {!selectedProto ? "Proto" : selectedProto}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup
                      type="radio"
                      value={selectedProto.toString()}
                      onChange={(value) => setSelectedProto(value)}
                    >
                      <MenuItemOption value="">All</MenuItemOption>
                      {uniquePrototype.map((proto) => (
                        <MenuItemOption key={proto} value={proto.toString()}>
                          {proto}
                        </MenuItemOption>
                      ))}
                    </MenuOptionGroup>
                  </MenuList>
                </>
              )}
            </Menu>
            <Button
              rightIcon={GrPowerReset}
              colorScheme="red"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Heading size="md" color="gray.500" my={5}>
        Recent Update
      </Heading>

      {isLoading && (
        <SimpleGrid columns={3} spacing={10}>
          <CardSkeleton />
        </SimpleGrid>
      )}

      {!isLoading && filteredData.length === 0 ? (
        <div className="flex justify-center items-center flex-col">
          <h3>No List Found</h3>
          <Link to="/new-item">
            <Button>Create New Style</Button>
          </Link>
        </div>
      ) : (
        <>
          <SimpleGrid columns={3} spacing={10}>
            {filteredData.slice(0, 3).map((list, index) => (
              <CollectionCard
                key={index}
                list={list}
                maxWidth="md"
                updateItemInData={updateItemInData}
              />
            ))}
          </SimpleGrid>

          {filteredData.length > 3 && (
            <>
              <Heading size="md" color="gray.500" my={5}>
                Older
              </Heading>
              <CarouselCollection>
                {filteredData.slice(3).map((list, index) => (
                  <CollectionCard
                    key={index}
                    list={list}
                    maxWidth="md"
                    updateItemInData={updateItemInData}
                  />
                ))}
              </CarouselCollection>
            </>
          )}
        </>
      )}
    </Container>
  );
}
