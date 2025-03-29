import "../App.css";

export default function MovieDisplay({ movie, onBan }) {
  return (
    <div className="movie-container">
      <div className="movie-card">
        <h2>{movie.Title} ({movie.Year})</h2>
        {movie.Poster !== "N/A" ? (
          <img src={movie.Poster} alt={movie.Title} />
        ) : (
          <p>No Poster Available</p>
        )}
        <p>
          <strong>Genre:</strong>{" "}
          <span className="clickable" onClick={() => onBan("genre", movie.Genre)}>
            {movie.Genre}
          </span>
        </p>
        <p>
          <strong>Director:</strong>{" "}
          <span className="clickable" onClick={() => onBan("director", movie.Director)}>
            {movie.Director}
          </span>
        </p>
        <p>
          <strong>Year:</strong>{" "}
          <span className="clickable" onClick={() => onBan("year", movie.Year)}>
            {movie.Year}
          </span>
        </p>
      </div>
    </div>
  );
}
