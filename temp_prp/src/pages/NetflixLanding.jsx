import React from 'react';
import Navbar from '../components/netflix/Navbar';
import Banner from '../components/netflix/Banner';
import Row from '../components/netflix/Row';
import { requests } from '../services/tmdb';

const NetflixLanding = () => {
    return (
        <div className="bg-[#111] min-h-screen">
            <Navbar />
            <Banner />
            <div className="pb-10">
                <Row
                    title="NETFLIX ORIGINALS"
                    fetchUrl={requests.fetchNetflixOriginals}
                    isLargeRow
                />
                <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
                <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
                <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
                <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
                <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
                <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
                <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
            </div>
        </div>
    );
};

export default NetflixLanding;
