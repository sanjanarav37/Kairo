import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";

function CreateRoom() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");

  const generateRoomCode = () => {
    return (
      "KAIRO-" +
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
  };

 const handleCreateRoom = async (e) => {
  e.preventDefault();

  if (!name || !roomName) return;

  const roomCode = generateRoomCode();

  const { error } = await supabase
    .from("rooms")
    .insert([
      {
        room_code: roomCode,
        room_name: roomName,
        
      },
    ]);

  if (error) {
    console.error("Room creation error:", error);
    alert("Could not create room");
    return;
  }

const { error: memberError } = await supabase
  .from("room_members")
  .insert([
    {
      room_code: roomCode,
      name: name,
    },
  ]);

if (memberError) {
  console.error("Member error:", memberError);
  alert("Room created but could not add you to the room.");
  return;
}

  navigate(`/room/${roomCode}`, {
    state: {
      name,
      roomName,
      isHost: true,
    },
  });
};

  return (
    <main className="room-page">
      <div className="room-form">

        <button
          className="room-back"
          onClick={() => navigate("/room")}
        >
          ← Back
        </button>

        <h1>Create Your Room</h1>

        <p className="room-subtitle">
          Create a room and find an anime everyone will love.
        </p>

        <form onSubmit={handleCreateRoom}>

          <label>Your Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Room Name</label>

          <input
            type="text"
            placeholder="Anime Night"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <button type="submit" className="room-primary-btn">
            Create Room
          </button>

        </form>
      </div>
    </main>
  );
}

export default CreateRoom;