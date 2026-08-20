import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://api.jikan.moe/v4";

function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/anime/${id}/full`
        );

        const data = await response.json();
        setAnime(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!anime) return <p>Anime not found.</p>;

  return (
    <main className="anime-details">
      <img className="anime-details-poster"
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
      />
  <div className="anime-details-info">
      <h1>{anime.title}</h1>

      <p>{anime.synopsis}</p>

      <p>⭐ {anime.score}</p>

      <p>
        {anime.year || "Unknown Year"} • {anime.episodes || "Unknown"} Episodes
      </p>

      <div>
        {anime.genres.map((genre) => (
          <span key={genre.mal_id}>
            {genre.name}
          </span>
        ))}
      </div>
      </div>
    </main>
  );
}

export default AnimeDetails;