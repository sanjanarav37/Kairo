import React from 'react'
import { useNavigate } from 'react-router-dom';

const AnimeCard = ({anime}) => {
  const navigate = useNavigate();
    const releaseYear = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : "Unknow";
  return (
    <div className="anime-card"
      onClick={() => navigate(`anime/${anime.mal_id}`)} >
      <img src={anime.images?.jpg?.large_image_url} alt={anime.title} />

      <div className="mt-4">
      <h3>{anime.title}</h3>

      <div className="content">
        <div className="rating-year">
    <div><pre>⭐{anime.score ? anime.score : "N/A"}  •  {releaseYear} </pre></div>
      </div>
</div>
      <p className="japanese-title">{anime.title_japanese ? anime.title_japanese : "Japanese title unavailable" }</p>
     </div>
      </div>
    
  )
}

export default AnimeCard;



















































































































