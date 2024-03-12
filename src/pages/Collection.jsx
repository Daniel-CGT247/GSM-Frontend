import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  InputRightElement,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import CardSkeleton from "../components/CardSkeleton";
import CarouselCollection from "../components/Carousel";
import CollectionCard from "../components/CollectionCard";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import { CloseIcon } from "@chakra-ui/icons";
import { FaChevronDown } from "react-icons/fa6";

export default function Collection() {
  const { data, isLoading } = useGet(`${endpoint}/collection/`);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedProto, setSelectedProto] = useState("");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSeason("");
    setSelectedProto("");
  };

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

  return (
    <Container maxW="8xl" py={8}>
      <Box
        p={2}
        shadow="md"
        bgColor="white"
        position="sticky"
        top={"50px"}
        zIndex={9}
      >
        <Flex alignItems="center" my={0} justifyContent="space-between" gap={4}>
          <Heading size="lg">Collection</Heading>
          <InputGroup width="50%">
            <InputLeftElement pointerEvents="none">
              <IoSearch color="gray.300" />
            </InputLeftElement>

            <Input
              className="text-center"
              type="text"
              placeholder="Search a Style"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <InputRightElement>
                <Box as="button" onClick={() => setSearchTerm('')}>
                  <CloseIcon boxSize="3" /> 
                </Box>
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
              <CollectionCard key={index} list={list} maxWidth="md" />
            ))}
          </SimpleGrid>

          {filteredData.length > 3 && (
            <>
              <Heading size="md" color="gray.500" my={5}>
                Older
              </Heading>
              <CarouselCollection>
                {filteredData.slice(3).map((list, index) => (
                  <CollectionCard key={index} list={list} maxWidth="sm" />
                ))}
              </CarouselCollection>
            </>
          )}
        </>
      )}
    </Container>
  );
}
