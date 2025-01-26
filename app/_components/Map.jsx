"use client";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import json from "@/features.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Map = ({ maps }) => {
  const [continents, setContinents] = useState([]);
  const [hoveredContinent, setHoveredContinent] = useState(null); // State to track hovered continent
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Tooltip position

  const changeContinent = (e) => {
    setContinents(e);
  };

  const isHighlighted = (geo) => {
    const continent = geo.properties.CONTINENT;
    return continents.includes(continent);
  };

  const handleMouseEnter = (geo, event) => {
    const continent = geo.properties.CONTINENT;
    setHoveredContinent(continent);
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => {
    setHoveredContinent(null);
  };

  const getContinentDetails = (continent) => {
    const getContinent = maps?.find((e) => e.continent === continent);
    return getContinent ? getContinent.count : "N/A";
  };

  return (
    <div
      className={`map_container p-4 shadows rounded-md w-full bg-[--foreground] h-full flex flex-col gap-4`}
    >
      <h3>Visitors by regions</h3>
      <ComposableMap>
        <Geographies geography={json}>
          {({ geographies }) =>
            geographies.map((geo) => {
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isHighlighted(geo) ? "#22ad01" : "#D6D6DA",
                      outline: "none",
                    },
                    hover: {
                      fill: isHighlighted(geo) ? "var(--background)" : "#111",
                      outline: "none",
                    },
                    pressed: {
                      fill: isHighlighted(geo) ? "#22ad01" : "#E42",
                      outline: "none",
                    },
                  }}
                  onMouseEnter={(event) => handleMouseEnter(geo, event)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Select onValueChange={changeContinent}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select continents" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Africa">Africa</SelectItem>
          <SelectItem value="Antarctica">Antarctica</SelectItem>
          <SelectItem value="Asia">Asia</SelectItem>
          <SelectItem value="Oceania">Australia</SelectItem>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="North America">North America</SelectItem>
          <SelectItem value="South America">South America</SelectItem>
        </SelectContent>
      </Select>

      {hoveredContinent && (
        <div
          className="absolute bg-[--background] text-[--primary-text-color] py-1 px-2 z-[999999] rounded shadows"
          style={{
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
          }}
        >
          <h5 className="text-[.8rem] font-bold">{hoveredContinent}</h5>
          <p className="text-[.7rem]">
            Total Visits{" "}
            <span className="text-[.7rem] font-bold">
              {getContinentDetails(hoveredContinent)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;
