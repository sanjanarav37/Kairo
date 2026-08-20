import homebg from './assets/homebg.jpeg'
import Navbar from './components/Navbar.jsx'
import Search from './components/search.jsx'
import Spinner from './components/Spinner.jsx'
import AnimeCard from './components/AnimeCard.jsx'
import { useState, useEffect } from "react";
import {useDebounce} from "react-use";
import AnimeDetails from './components/AnimeDetails.jsx'
import { Routes, Route } from 'react-router-dom'
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import AnimeRoom from "./pages/AnimeRoom";
import Footer from './components/Footer.jsx'

const API_BASE_URL = "https://api.jikan.moe/v4";

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
    const [latestAnime, setLatestAnime] = useState([]);

    useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);


    const fetchAnimes = async (query = '', signal) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query
                ? `${API_BASE_URL}/anime?q=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/top/anime?limit=10`;

            const response = await fetch(endpoint, { signal });

            if (response.status === 429) {
                throw new Error("Too many requests — please slow down and try again.");
            }
            if (!response.ok) {
                throw new Error("Failed to fetch animes");
            }

            const data = await response.json();
            setAnimeList(data.data || []);
        } catch (error) {
            if (error.name === 'AbortError') return; // ignore cancelled requests
            console.error(`Error fetching animes: ${error}`);
            setErrorMessage(error.message || "Error fetching animes. Please try later.");
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            fetchAnimes(debouncedSearchTerm, controller.signal);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [debouncedSearchTerm]);

const fetchLatestAnime = async () => {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/anime?status=airing&order_by=aired&sort=desc&limit=10"
    );

    if (!response.ok) {
      console.log("Latest API error:", response.status);
      return;
    }

    const data = await response.json();

    setLatestAnime(data.data || []);
  } catch (error) {
    console.error("Latest anime error:", error);
  }
};

useEffect(() => {
  fetchLatestAnime();
}, []);
    

    return (
         <Routes>
         <Route path='/' element={
        <main>
            <div className="wrpper">
                <Navbar />
                <header>
                    <img src={homebg} alt="heroBG" />
                    <h1>
                        Discover your next
                        <span className="text-gradient"> Anime </span>
                        obsession in just few clicks
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
      

                <section className="all-anime">
                    <h2 className='mt-[40px]'>All Anime</h2>

                    {isLoading ? (
                        <div className="flex justify-center w-full">
                            <Spinner />
                        </div>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {animeList.map((anime) => (
                                <AnimeCard key={anime.mal_id} anime={anime} />
                            ))}
                        </ul>
                    )}
                </section>
        
        
                  < Footer />

            </div>
        </main> } 
        />

        <Route path='/anime/:id' element={
        <AnimeDetails />
        } />

        <Route path='/room' element={<Room />} />
        <Route path='/room/create' element={<CreateRoom />} />
        <Route path='/room/join' element={<JoinRoom />} />
         <Route path='/room/:roomCode' element={<AnimeRoom />} />
        
        </Routes>

      
    );
};

export default App;

























