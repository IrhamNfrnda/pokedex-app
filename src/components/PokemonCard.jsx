import React from 'react';
import { Link } from 'react-router-dom';

const PokemonCard = ({ id, name, types, imageSrc }) => {
    return (
        <div className="card mb-3">
            <Link className='text-decoration-none' to={`/pokemon/${id}`}>
                <img
                    src={imageSrc}
                    className="card-img-top"
                    alt={name}
                />
                <div className="card-body text-center">
                    <h5 className="card-subtitle">#{id}</h5>
                    <h2 className="card-title mb-2 text-muted">
                        {name}
                    </h2>
                    <p className="card-text">
                        <strong>Types:</strong> {types.join(' / ')}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default PokemonCard;
