import React, { useState, useEffect } from 'react';
import { fetchData, requests } from '../../services/tmdb';

const Banner = () => {
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        async function getMovie() {
            const results = await fetchData(requests.fetchNetflixOriginals);
            setMovie(
                results[Math.floor(Math.random() * results.length - 1)]
            );
        }
        getMovie();
    }, []);

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    return (
        <header
            className="relative h-[448px] text-white object-contain"
            style={{
                backgroundSize: "cover",
                backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
                backgroundPosition: "center center",
            }}
        >
            <div className="ml-8 pt-36 h-[190px]">
                <h1 className="text-5xl font-extrabold pb-1">
                    {movie?.title || movie?.name || movie?.original_name}
                </h1>

                <div className="flex gap-4">
                    <button className="cursor-pointer text-white font-bold rounded-sm px-8 py-2 bg-[rgba(51,51,51,0.5)] hover:text-black hover:bg-[#e6e6e6] transition-all duration-200">
                        Play
                    </button>
                    <button className="cursor-pointer text-white font-bold rounded-sm px-8 py-2 bg-[rgba(51,51,51,0.5)] hover:text-black hover:bg-[#e6e6e6] transition-all duration-200">
                        My List
                    </button>
                </div>

                <h1 className="w-[45rem] leading-[1.3] pt-4 text-sm max-w-[360px] h-[80px]">
                    {truncate(movie?.overview, 150)}
                </h1>
            </div>

            <div className="h-[7.4rem] bg-gradient-to-b from-transparent via-[rgba(37,37,37,0.61)] to-[#111] absolute bottom-0 w-full" />
        </header>
    );
};

export default Banner;
