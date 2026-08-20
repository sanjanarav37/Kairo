import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { supabase } from "../supabaseClient";

const API_BASE_URL = "https://api.jikan.moe/v4";

function AnimeRoom() {
  const { roomCode } = useParams();
  const location = useLocation();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [vote, setVote] = useState([]);
  const [match, setMatch] = useState(false);

  const name = location.state?.name || "Guest";
  const roomName = location.state?.roomName || "Anime Room";
const fetchRandomAnime = async () => {
  try {
    setLoading(true);
    setVote(null);

    const randomPage = Math.floor(Math.random() * 5) + 1;

    const response = await fetch(
      `${API_BASE_URL}/top/anime?page=${randomPage}&limit=8`
    );

    if (!response.ok) {
      throw new Error(`Anime API failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error("No anime received");
    }

    const randomAnime =
      data.data[Math.floor(Math.random() * data.data.length)];

    setAnime(randomAnime);

  } catch (error) {
    console.error("Jikan API error:", error);

    // Fallback anime if Jikan is down
    const fallbackAnime = [
      {
        mal_id: 5114,
        title: "Fullmetal Alchemist: Brotherhood",
        score: 9.1,
        year: 2009,
        episodes: 64,
        synopsis:
          "Two brothers search for the Philosopher's Stone after a failed alchemy experiment changes their lives.",
        images: {
          jpg: {
            large_image_url:
              "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg",
          },
        },
        genres: [
          { mal_id: 1, name: "Action" },
          { mal_id: 2, name: "Adventure" },
          { mal_id: 8, name: "Drama" },
        ],
      },

      {
        mal_id: 52991,
        title: "Sousou no Frieren",
        score: 9.2,
        year: 2023,
        episodes: 28,
        synopsis:
          "An elven mage begins a new journey after the end of a legendary adventure.",
        images: {
          jpg: {
            large_image_url:
              "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
          },
        },
        genres: [
          { mal_id: 2, name: "Adventure" },
          { mal_id: 8, name: "Drama" },
          { mal_id: 10, name: "Fantasy" },
        ],
      },

      {
        mal_id: 9253,
        title: "Steins;Gate",
        score: 9.0,
        year: 2011,
        episodes: 24,
        synopsis:
          "A group of friends discover a way to send messages into the past, leading to unexpected consequences.",
        images: {
          jpg: {
            large_image_url:
              "https://cdn.myanimelist.net/images/anime/5/73199l.jpg",
          },
        },
        genres: [
          { mal_id: 24, name: "Sci-Fi" },
          { mal_id: 8, name: "Drama" },
          { mal_id: 41, name: "Suspense" },
        ],
      },
    ];

    const randomAnime =
      fallbackAnime[Math.floor(Math.random() * fallbackAnime.length)];

    setAnime(randomAnime);

  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchRandomAnime();
}, []);

useEffect(() => {
  if (!anime || match) return;

  const interval = setInterval(() => {
    checkForMatch();
  }, 2000);

  return () => clearInterval(interval);
}, [anime, match]);


useEffect(() => {
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_code", roomCode);

    if (error) {
      console.error("Members error:", error);
      return;
    }

    setMembers(data || []);
  };

  fetchMembers();
}, [roomCode]);

const handleVote = async (type) => {
  setVote(type);

  const { error } = await supabase
    .from("room_votes")
    .insert([
      {
        room_code: roomCode,
        anime_id: anime.mal_id,
        name: name,
        vote: type,
      },
    ]);

  if (error) {
    console.error("Vote error:", error);
    return;
  }

  checkForMatch();
};

const checkForMatch = async () => {
  // Get all members in this room
  const { data: members, error: memberError } = await supabase
    .from("room_members")
    .select("name")
    .eq("room_code", roomCode);

  if (memberError || !members) return;

  // Get likes for current anime
  const { data: votes, error: voteError } = await supabase
    .from("room_votes")
    .select("name")
    .eq("room_code", roomCode)
    .eq("anime_id", anime.mal_id)
    .eq("vote", "like");

  if (voteError || !votes) return;

  // Unique people who liked
  const uniqueLikes = new Set(votes.map((v) => v.name));

  // Everyone liked it
  if (uniqueLikes.size >= members.length) {
    setMatch(true);
  }
};

  if (loading) {
    return (
      <main className="room-page">
        <p className="room-loading">Finding an anime...</p>
      </main>
    );
  }

  if (!anime) {
    return (
      <main className="room-page">
        <p className="room-loading">
          Couldn't find an anime.
        </p>
      </main>
    );
  }

  if (match) {
  return (
    <main className="room-page">
      <div className="match-card">
        <div className="match-icon">❤️</div>

        <h1>It's a Match!</h1>

        <p>
          Everyone wants to watch
        </p>

        <h2>{anime.title}</h2>

        <button
          className="room-primary-btn"
          onClick={() => {
            setMatch(false);
            fetchRandomAnime();
          }}
        >
          Find Another Anime
        </button>
      </div>
    </main>
  );
}

  return (
    <main className="anime-room">

      <div className="room-header">
        <div>
          <p className="room-code">{roomCode}</p>
          <h1>{roomName}</h1>
        </div>

       <div className="room-members">
  👥 {members.length}

  {members.map((member) => (
    <span key={member.id}>
      {member.name}
    </span>
  ))}
</div>

      <div className="anime-decision-card">

        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
        />

        <div className="anime-decision-info">

          <p className="room-label">
            What should you watch?
          </p>

          <h2>{anime.title}</h2>

          <div className="anime-meta">
            <span>⭐ {anime.score || "N/A"}</span>
            <span>{anime.year || "N/A"}</span>
            <span>{anime.episodes || "?"} Episodes</span>
          </div>

          <div className="room-genres">
            {anime.genres?.map((genre) => (
              <span key={genre.mal_id}>
                {genre.name}
              </span>
            ))}
          </div>

          <p className="anime-description">
            {anime.synopsis || "No description available."}
          </p>

          <div className="vote-buttons">

            <button
              className={`skip-btn ${
                vote === "skip" ? "selected" : ""
              }`}
              onClick={() => handleVote("skip")}
            >
              ✕ Skip
            </button>

            <button
              className={`like-btn ${
                vote === "like" ? "selected" : ""
              }`}
              onClick={() => handleVote("like")}
            >
              ♥ Like
            </button>

          </div>

          {vote && (
            <button
              className="next-anime-btn"
              onClick={fetchRandomAnime}
            >
              Show Me Another →
            </button>
          )}

        </div>
      </div>
</div>
    </main>
  );

}

export default AnimeRoom;