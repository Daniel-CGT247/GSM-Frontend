import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
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
import { FaChevronDown } from "react-icons/fa6";

export default function Collection() {
  const { data, isLoading } = useGet(`${endpoint}/collection/`);
  const [searchTerm, setSearchTerm] = useState(""); // search bar
  const [selectedSeason, setSelectedSeason] = useState(""); // season dropdown
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
    <Container maxW="7xl" p={10}>
      <Heading size="xl">Collection</Heading>

      <Flex alignItems="center" gap={4} my={5}>
      <InputGroup width="55%"> 
        <InputLeftElement pointerEvents="none">
          <IoSearch color="gray.300" />
        </InputLeftElement>
        <Input
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
                  value={selectedProto.toString()}
                  onChange={(value) => {
                    setSelectedProto(parseInt(value))
                  }}
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

        <Button colorScheme="red" onClick={resetFilters}>
          <Flex alignItems="center" gap={2}>
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


// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Button,
//   Container,
//   Flex,
//   Heading,
//   Icon,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Menu,
//   MenuButton,
//   MenuItemOption,
//   MenuList,
//   MenuOptionGroup,
// } from "@chakra-ui/react";
// import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { GrPowerReset } from "react-icons/gr";
// import { IoSearch } from "react-icons/io5";
// import CollectionCard from "../components/CollectionCard";
// import useGet from "../customed_hook/useGet";
// import endpoint from "../utils/endpoint";
// import CarouselCollection from "../components/Carousel";
// import CardSkeleton from "../components/CardSkeleton"; // Import the CardSkeleton component

// export default function Collection() {
//   const { data, isLoading } = useGet(`${endpoint}/collection/`);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSeason, setSelectedSeason] = useState("");
//   const [selectedProto, setSelectedProto] = useState("");
//   const [startIndex, setStartIndex] = useState(0);

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedSeason("");
//     setSelectedProto("");
//   };

//   const filteredData = data.filter(
//     (item) =>
//       item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (selectedSeason === "" || item.item.season === selectedSeason) &&
//       (selectedProto === "" || item.item.proto === parseInt(selectedProto))
//   );

//   const uniqueSeasons = [...new Set(data.map((item) => item.item.season))].sort();
//   const uniquePrototype = [...new Set(data.map((item) => item.item.proto))].sort();

//   const handleNext = () => {
//     setStartIndex((prevIndex) => prevIndex + 1);
//   };

//   const handlePrev = () => {
//     setStartIndex((prevIndex) => prevIndex - 1);
//   };

//   return (
//     <Container maxW="7xl" p={10}>
//       <Heading size="xl" mb={5}>
//         Collection
//       </Heading>

//       <Flex alignItems="center" gap={4} mb={5}>
//       <InputGroup width="65%"> {/* Change width to 100% */}
//   <InputLeftElement pointerEvents="none">
//     <IoSearch color="gray.300" />
//   </InputLeftElement>
//   <Input
//     type="text"
//     placeholder="Search a Style"
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//   />
// </InputGroup>


//         <Menu>
//           <MenuButton as={Button} rightIcon={<FaChevronDown />}>
//             {selectedSeason || "Season"}
//           </MenuButton>
//           <MenuList>
//             <MenuOptionGroup type="radio" onChange={setSelectedSeason}>
//               <MenuItemOption value="">All</MenuItemOption>
//               {uniqueSeasons.map((season) => (
//                 <MenuItemOption key={season} value={season}>
//                   {season}
//                 </MenuItemOption>
//               ))}
//             </MenuOptionGroup>
//           </MenuList>
//         </Menu>

//         <Menu>
//           <MenuButton as={Button} rightIcon={<FaChevronDown />}>
//             {selectedProto || "Proto"}
//           </MenuButton>
//           <MenuList>
//             <MenuOptionGroup type="radio" onChange={setSelectedProto}>
//               <MenuItemOption value="">All</MenuItemOption>
//               {uniquePrototype.map((proto) => (
//                 <MenuItemOption key={proto} value={proto}>
//                   {proto}
//                 </MenuItemOption>
//               ))}
//             </MenuOptionGroup>
//           </MenuList>
//         </Menu>

//         <Button colorScheme="red" onClick={resetFilters}>
//           <Flex alignItems="center" gap={2}>
//             Reset filters
//             <Icon as={GrPowerReset} />
//           </Flex>
//         </Button>
//       </Flex>

//       {isLoading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//           <CardSkeleton />
//         </div>
//       ) : filteredData.length === 0 ? (
//         <div className="flex flex-col items-center">
//           <h3>No List Found</h3>
//           <Link to="/new-item">
//             <Button mt={3}>Create New Style</Button>
//           </Link>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//             {filteredData.slice(0, 4).map((list, index) => (
//               <CollectionCard key={index} list={list} />
//             ))}
//           </div>

//           <h3 className="text-gray-500 mb-3">Older</h3>

//           <div className="relative">
//             {startIndex > 0 && (
//               <button
//                 className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
//                 onClick={handlePrev}
//               >
//                 <FaChevronLeft />
//               </button>
//             )}
//             <CarouselCollection>
//               {filteredData.slice(startIndex + 4).map((list, index) => (
//                 <CollectionCard key={index} list={list} maxWidth="sm" />
//               ))}
//             </CarouselCollection>
          
//           </div>

//           <h3 className="text-gray-500 mb-3 mt-8">Older Styles</h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             {filteredData.slice(4).map((list, index) => (
//               <CollectionCard key={index} list={list} />
//             ))}
//           </div>
//         </>
//       )}
//     </Container>
//   );
// }
