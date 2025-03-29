export default function BanList({ bannedGenres, bannedDirectors, bannedYears, onUnban }) {
    return (
      <div className="ban-list">
        <h3>Banned Genres</h3>
        <ul>
          {bannedGenres.map((genre, index) => (
            <li key={index} onClick={() => onUnban("genre", genre)}>{genre}</li>
          ))}
        </ul>
  
        <h3>Banned Directors</h3>
        <ul>
          {bannedDirectors.map((director, index) => (
            <li key={index} onClick={() => onUnban("director", director)}>{director}</li>
          ))}
        </ul>
  
        <h3>Banned Years</h3>
        <ul>
          {bannedYears.map((year, index) => (
            <li key={index} onClick={() => onUnban("year", year)}>{year}</li>
          ))}
        </ul>
      </div>
    );
  }
  