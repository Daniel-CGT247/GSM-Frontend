import {
  Button,
  Flex,
  Icon,
  Menu,
  Input,
  InputGroup,
  InputLeftElement,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Heading,
  Container,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { Link } from "react-router-dom";
import CardSkeleton from "../components/CardSkeleton";
import CarouselCollection from "../components/Carousel";
import CollectionCard from "../components/CollectionCard";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";
import { IoSearch } from "react-icons/io5";

import { FaChevronDown } from "react-icons/fa6";
export default function Collection() {
  const { data, isLoading } = useGet(`${endpoint}/collection/`);
  const [searchTerm, setSearchTerm] = useState(""); // search bar
  const [selectedSeason, setSelectedSeason] = useState(""); // season dropdown
  const [selectedProto, setSelectedProto] = useState("");

  // reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSeason("");
    setSelectedProto("");
  };

  const filteredData = data.filter(
    (item) =>
      item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      // dropdown for season
      (selectedSeason === "" || item.item.season === selectedSeason) &&
      // dropdown for proto
      (selectedProto === "" || item.item.proto === parseInt(selectedProto))
  );

  // get seasons for dropdown
  const uniqueSeasons = [
    ...new Set(data.map((item) => item.item.season)),
  ].sort();

  const uniquePrototype = [
    ...new Set(data.map((item) => item.item.proto)),
  ].sort();

  return (
    <Container maxW="7xl" p={10}>
      <Heading size="xl">Collection</Heading>

      <Flex alginItems="center" gap={4} my={5}>
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
        </InputGroup>
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
                  onChange={(value) => setSelectedProto(value)}
                >
                  <MenuItemOption value="">All</MenuItemOption>
                  {uniquePrototype.map((proto) => (
                    <MenuItemOption key={proto} value={proto}>
                      {proto}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </>
          )}
        </Menu>

        <Button colorScheme="red" onClick={resetFilters}>
          <Flex alginItems="center" gap={2}>
            Reset filters
            <Icon as={GrPowerReset} />
          </Flex>
        </Button>
      </Flex>

      <h3 className="text-slate-400">Recent Update</h3>

      {isLoading && (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 pb-5">
          <CardSkeleton />
        </div>
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
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 pb-5">
            {filteredData.slice(0, 4).map((list, index) => (
              <CollectionCard key={index} list={list} maxWidth="md" />
            ))}
          </div>

          <h3 className="text-slate-400">Older</h3>

          <CarouselCollection>
            {filteredData.slice(4).map((list, index) => (
              <CollectionCard key={index} list={list} maxWidth="sm" />
            ))}
          </CarouselCollection>
        </>
      )}
    </Container>
  );
}
