import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const apiURL = `https://pokeapi.co/api/v2/pokemon/`;
  const perPage = 20;
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    loadMorePokemon();
  }, []); // Initial load

  // Use a ref to track the bottom of the scroll container
  const bottomRef = useRef();

  // Function to load more Pokemon data
  const loadMorePokemon = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.get(`${apiURL}?offset=${offset}&limit=${perPage}`);
      const data = response.data.results;
      const promises = data.map(async (pokemon) => {
        const detailsResponse = await axios.get(pokemon.url);
        const details = detailsResponse.data;
        const types = details.types.map((type) => type.type.name);
        const moves = details.moves.slice(0, 4).map((move) => move.move.name);
        const imageSrc = details.sprites.front_default;

        return {
          id: details.id,
          name: details.name,
          types,
          imageSrc,
          moves,
        };
      });

      const newPokemonData = await Promise.all(promises);
      setPokemonList((prevPokemonList) => [...prevPokemonList, ...newPokemonData]);
      setOffset((prevOffset) => prevOffset + perPage);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  // Intersection Observer to trigger loading more data when scrolling to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          // Use a debounce mechanism to prevent multiple calls in quick succession
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }

          debounceTimeoutRef.current = setTimeout(() => {
            loadMorePokemon();
          }, 200); // Adjust the debounce timeout as needed
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [isLoading]); // Add isLoading as a dependency

  const filterPokemon = () => {
    const inputValue = filterValue.toLowerCase();
    const filteredData = pokemonList.filter((pokemon) => {
      if (filterBy === "type") {
        return pokemon.types.some((type) => type.includes(inputValue));
      } else {
        return pokemon.name.toLowerCase().includes(inputValue);
      }
    });
    setFilteredPokemonList(filteredData);
  };

  const handleInputChange = (e) => {
    setFilterValue(e.target.value);
    filterPokemon();
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  return (
    <div className="container">
      <header className="App-header text-center">
        <h1>Pokedex</h1>
        <div className="row justify-content-center align-items-center mt-2">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by type..."
                value={filterValue}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              onChange={handleFilterChange}
              value={filterBy}
            >
              <option value="name">Filter by...</option>
              <option value="name">Name</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </header>
      <div className="row mt-5">
        {filterValue
          ? filteredPokemonList.map((pokemon) => (
            <div key={pokemon.id} className="col-md-4">
              <PokemonCard {...pokemon} />
            </div>
          ))
          : pokemonList.map((pokemon) => (
            <div key={pokemon.id} className="col-md-4">
              <PokemonCard {...pokemon} />
            </div>
          ))}
      </div>
      {isLoading && <p>Loading...</p>}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default App;
