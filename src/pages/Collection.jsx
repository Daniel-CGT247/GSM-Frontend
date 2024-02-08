import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import CarouselCollection from "../components/Carousel";
import CollectionCard from "../components/CollectionCard";
import useGet from "../customed_hook/useGet";
import endpoint from "../utils/endpoint";

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

  // search bar
  // filter user input
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
    <div className="p-5">
      <h1 className="font-bold">Collection</h1>

      {/* search bar for ref style */}
      <div className="flex justify-center items-center gap-4 mb-6">
        {/* search bar */}
        <input
          className="text-center"
          type="text"
          placeholder="Search by Reference Style"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* season dropdown */}
        <select
          className="text-center"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          <option value="">Seasons</option>
          {uniqueSeasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>

        {/* proto dropdown */}
        <select
          className="text-center"
          value={selectedProto}
          onChange={(e) => setSelectedProto(e.target.value)}
        >
          <option value="">Proto</option>
          {uniquePrototype.map((proto) => (
            <option key={proto} value={proto}>
              {proto}
            </option>
          ))}
        </select>

        {/* reset btn */}
        <button onClick={resetFilters} className="your-reset-button-class">
          Reset filters
        </button>
      </div>

      {filteredData.length === 0 && (
        <div className="flex justify-center items-center flex-col">
          <h3>No List Found</h3>

          <Link to="/new-item">
            <Button>Create New Style</Button>
          </Link>
        </div>
      )}

      {filteredData.length !== 0 && (
        <>
          <h3 className="text-slate-400">Recent Update</h3>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 pb-5">
            {filteredData.slice(0, 4).map((list, index) => (
              <CollectionCard key={index} list={list} />
            ))}
          </div>

          <hr />

          <h3 className="text-slate-400">Older</h3>

          <CarouselCollection>
            {filteredData.slice(4).map((list, index) => (
              <CollectionCard key={index} list={list} />
            ))}
          </CarouselCollection>
        </>
      )}
    </div>
  );
}
