import { useNavigate } from "react-router-dom"

function Room() {
  const navigate = useNavigate();

  return (
    <main className="room-page">
      <div className="room-choice">

        <h1>Anime Room</h1>

        <p className="room-subtitle">
          Find the perfect anime together with your friends.
        </p>

        <div className="room-options">

          <button
            className="room-option"
            onClick={() => navigate("/room/create")}
          >
            <span className="room-icon">＋</span>
            <h2>Create a Room</h2>
            <p>Start a new anime decision room.</p>
          </button>

          <button
            className="room-option"
            onClick={() => navigate("/room/join")}
          >
            <span className="room-icon">↗</span>
            <h2>Join a Room</h2>
            <p>Enter a room code and join your friends.</p>
          </button>

        </div>
      </div>
    </main>
  );
}

export default Room;