import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
  const { pokemonId } = useParams();

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const details = response.data;
        const types = details.types.map((type) => type.type.name);
        const moves = Array.isArray(details.moves)
          ? details.moves
            .map((move) => move.move.name)
            .slice(0, 4)
            .map((move) => `<li>${move}</li>`)
            .join('')
          : [];
        const { front_default: imageSrc } = details.sprites;
        const { name, id, weight, height, stats } = details;

        setPokemon({
          id,
          name,
          types,
          imageSrc,
          moves,
          weight,
          height,
          stats,
        });
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    };

    fetchPokemonDetail();
  }, [pokemonId]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 w-100">
        <div className="row">
          <div className="col-md-6 text-center">
            <img
              src={pokemon.imageSrc}
              alt={pokemon.name}
              className="img-fluid w-100"
            />
          </div>
          <div className="col-md-6">
            <h2 className="text-primary">{pokemon.name}</h2>
            <p>
              <strong>Types:</strong> {pokemon.types.join(', ')}
            </p>
            <p>
              <strong>Height:</strong> {pokemon.height} decimetres
            </p>
            <p>
              <strong>Weight:</strong> {pokemon.weight} hectograms
            </p>
            <p>
              <strong>Stats:</strong>
            </p>
            <ul className="list-group mb-4">
              {pokemon.stats.map((stat) => (
                <li
                  key={stat.stat.name}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <strong>{stat.stat.name}:</strong>
                  <div className="progress w-75">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      aria-valuenow={stat.base_stat}
                      aria-valuemin="0"
                      aria-valuemax="255"
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p>
              <strong>Moves:</strong>
            </p>
            <ul
              dangerouslySetInnerHTML={{ __html: pokemon.moves }}
              className="list-unstyled"
            />
          </div>
        </div>
      </div>
    </div>

  );
};

export default PokemonDetail;
