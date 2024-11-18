"use client"
import { useState, useEffect } from 'react';
import Countries from './components/Countries';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [continentFilter, setContinentFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [sortType, setSortType] = useState('name'); // Sort by name, population, or area
  const [top10Filter, setTop10Filter] = useState(false);

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

  // Filter and sort countries
  const filterCountries = () => {
    let filtered = countries;

    if (continentFilter) {
      filtered = filtered.filter((country) => country.continents.includes(continentFilter));
    }

    if (subregionFilter) {
      filtered = filtered.filter((country) => country.subregion === subregionFilter);
    }

    if (top10Filter) {
      filtered = filtered.slice(0, 10); // Show top 10
    }

    return sortCountries(filtered);
  };

  const sortCountries = (countries) => {
    if (sortType === 'name') {
      return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortType === 'population') {
      return countries.sort((a, b) => b.population - a.population);
    } else if (sortType === 'area') {
      return countries.sort((a, b) => b.area - a.area);
    }
    return countries;
  };

  useEffect(() => {
    setFilteredCountries(filterCountries());
  }, [continentFilter, subregionFilter, sortType, top10Filter, countries]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>World Countries</h1>

      {/* Filter Buttons */}
      <div>
        <h3>Filter by Continent</h3>
        <button onClick={() => setContinentFilter('Asia')}>Asia</button>
        <button onClick={() => setContinentFilter('Europe')}>Europe</button>
        <button onClick={() => setContinentFilter('Africa')}>Africa</button>
        <button onClick={() => setContinentFilter('Americas')}>Americas</button>
        <button onClick={() => setContinentFilter('Oceania')}>Oceania</button>
      </div>

      <div>
        <h3>Filter by Subregion</h3>
        <button onClick={() => setSubregionFilter('Southern Asia')}>Southern Asia</button>
        <button onClick={() => setSubregionFilter('Eastern Asia')}>Eastern Asia</button>
        <button onClick={() => setSubregionFilter('Northern Europe')}>Northern Europe</button>
      </div>

      {/* Top 10 Filter */}
      <div>
        <button onClick={() => setTop10Filter(!top10Filter)}>
          {top10Filter ? 'Show All' : 'Show Top 10'}
        </button>
      </div>

      {/* Sort Dropdown */}
      <div>
        <h3>Sort By</h3>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="name">Name</option>
          <option value="population">Population</option>
          <option value="area">Area</option>
        </select>
      </div>

      {/* Render Countries */}
      <Countries countries={filteredCountries} />
    </div>
  );
};

export default Home;
