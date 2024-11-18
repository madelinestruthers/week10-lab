"use client"
import { useState, useEffect } from 'react';
import Countries from './components/Countries';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [continentFilter, setContinentFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [top10ByPopulation, setTop10ByPopulation] = useState(false);
  const [top10ByArea, setTop10ByArea] = useState(false);

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      setCountries(data);
      setFilteredCountries(data);
    };
    fetchCountries();
  }, []);

  // Filter countries
  const filterCountries = () => {
    let filtered = countries;

    if (continentFilter) {
      filtered = filtered.filter((country) => country.continents.includes(continentFilter));
    }

    if (subregionFilter) {
      filtered = filtered.filter((country) => country.subregion === subregionFilter);
    }

    if (top10ByPopulation) {
      filtered = [...filtered].sort((a, b) => b.population - a.population).slice(0, 10);
    } else if (top10ByArea) {
      filtered = [...filtered].sort((a, b) => b.area - a.area).slice(0, 10);
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredCountries(filterCountries());
  }, [continentFilter, subregionFilter, top10ByPopulation, top10ByArea, countries]);

  // Get all unique continents and subregions for the dropdowns
  const uniqueContinents = [...new Set(countries.flatMap((country) => country.continents || []))];
  const uniqueSubregions = [...new Set(countries.map((country) => country.subregion).filter(Boolean))];

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="filters-header">World Countries</h1>

      {/* Filter Section */}
      <div className="filters-container">
        <h3>Filter by:</h3>

        {/* Top 10 Filters */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={top10ByPopulation}
              onChange={() => {
                setTop10ByPopulation(!top10ByPopulation);
                setTop10ByArea(false); // Disable other top 10 filter
              }}
            />
            Top 10 by Population
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="checkbox"
              checked={top10ByArea}
              onChange={() => {
                setTop10ByArea(!top10ByArea);
                setTop10ByPopulation(false); // Disable other top 10 filter
              }}
            />
            Top 10 by Area
          </label>
        </div>

        {/* Continent Filter */}
        <div>
          <label>By Continent:</label>
          <select
            value={continentFilter}
            onChange={(e) => {
              setContinentFilter(e.target.value);
              setSubregionFilter(''); // Clear subregion filter
            }}
          >
            <option value="">All Continents</option>
            {uniqueContinents.map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>
        </div>

        {/* Subregion Filter */}
        <div>
          <label>By Subregion:</label>
          <select
            value={subregionFilter}
            onChange={(e) => {
              setSubregionFilter(e.target.value);
              setContinentFilter(''); // Clear continent filter
            }}
          >
            <option value="">All Subregions</option>
            {uniqueSubregions.map((subregion) => (
              <option key={subregion} value={subregion}>
                {subregion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Countries */}
      <Countries countries={filteredCountries} />
    </div>
  );
};

export default Home;
