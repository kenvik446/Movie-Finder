import { useState } from "react";
import MovieDisplay from "./MovieDisplay.jsx";
import BanList from "./BanList.jsx";
import "../App.css";

const API_KEY = "b832e9bc9b35915ab42a61a66a679f73";
const TMDB_URL = "https://api.themoviedb.org/3";

export default function MovieApp() {
  const [movie, setMovie] = useState(null);
  const [bannedGenres, setBannedGenres] = useState([]);
  const [bannedDirectors, setBannedDirectors] = useState([]);
  const [bannedYears, setBannedYears] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchRandomMovie = async () => {
    const randomPage = Math.floor(Math.random() * 500) + 1;

    const response = await fetch(
      `${TMDB_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${randomPage}`
    );
    const data = await response.json();

    const results = data.results.filter(
      (m) => m.poster_path && m.title && m.release_date
    );

    if (results.length === 0) {
      fetchRandomMovie();
      return;
    }

    const randomMovie = results[Math.floor(Math.random() * results.length)];
    const releaseYear = randomMovie.release_date.split("-")[0];

    // Fetch full details to get genres
    const detailsRes = await fetch(
      `${TMDB_URL}/movie/${randomMovie.id}?api_key=${API_KEY}&language=en-US`
    );
    const details = await detailsRes.json();
    const genre = details.genres && details.genres.length > 0 ? details.genres[0].name : "Unknown";

    // Fetch credits to get director
    const creditsRes = await fetch(
      `${TMDB_URL}/movie/${randomMovie.id}/credits?api_key=${API_KEY}`
    );
    const credits = await creditsRes.json();
    const directorObj = credits.crew.find((person) => person.job === "Director");
    const director = directorObj ? directorObj.name : "Unknown";

    // Filter based on ban list
    if (
      !bannedGenres.includes(genre) &&
      !bannedDirectors.includes(director) &&
      !bannedYears.includes(releaseYear)
    ) {
      const movieData = {
        Title: randomMovie.title,
        Year: releaseYear,
        Poster: `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`,
        Genre: genre,
        Director: director,
      };

      setMovie(movieData);
      setHistory((prev) => [...prev, movieData]);
    } else {
      fetchRandomMovie(); // retry if banned
    }
  };

  const toggleBan = (type, value) => {
    if (type === "genre") {
      setBannedGenres((prev) =>
        prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
      );
    }
    if (type === "director") {
      setBannedDirectors((prev) =>
        prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
      );
    }
    if (type === "year") {
      setBannedYears((prev) =>
        prev.includes(value) ? prev.filter((y) => y !== value) : [...prev, value]
      );
    }
  };

  return (
    <div className="app-container">
      {/* Left: History */}
      <div className="sidebar">
        <h3>Who have we seen so far?</h3>
        {history.map((m, i) => (
          <div key={i} className="movie-history-item">
            <img src={m.Poster} alt={m.Title} />
            <p>{m.Title} ({m.Year})</p>
          </div>
        ))}
      </div>

      {/* Center: Main Content */}
      <div className="center-content">
        <h1>🎬 Movie Explorer</h1>
        <button onClick={fetchRandomMovie}>🎲 Discover!</button>
        {movie && <MovieDisplay movie={movie} onBan={toggleBan} />}
      </div>

      {/* Right: Ban List */}
      <div className="rightbar">
        <h3>Ban List</h3>
        <p>Select an attribute to ban/unban it</p>
        <BanList
          bannedGenres={bannedGenres}
          bannedDirectors={bannedDirectors}
          bannedYears={bannedYears}
          onUnban={toggleBan}
        />
      </div>
    </div>
  );
}
