import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/tmdb';

const Row = ({ title, fetchUrl, isLargeRow = false }) => {
    const [movies, setMovies] = useState([]);
    const base_url = "https://image.tmdb.org/t/p/original/";

    useEffect(() => {
        async function getMovies() {
            const results = await fetchData(fetchUrl);
            setMovies(results);
        }
        getMovies();
    }, [fetchUrl]);

    return (
        <div className="ml-5 text-white">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <div className="flex overflow-y-hidden overflow-x-scroll p-5 no-scrollbar">
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        className={`object-contain w-full max-h-[100px] mr-2 transition-transform duration-450 hover:scale-108 ${isLargeRow && "max-h-[250px] hover:scale-110"
                            }`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default Row;
