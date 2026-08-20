import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function JoinRoom() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (!name || !roomCode) {
      alert("Please enter your name and room code.");
      return;
    }

    const code = roomCode.trim().toUpperCase();

    // Check whether room exists
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", code)
      .single();

    if (roomError || !room) {
      alert("Room not found. Please check the room code.");
      return;
    }

    // Add user to room
    const { error: memberError } = await supabase
      .from("room_members")
      .insert([
        {
          room_code: code,
          name: name.trim(),
        },
      ]);

    if (memberError) {
      console.error("Join error:", memberError);
      alert("Could not join the room.");
      return;
    }

    // Go to Anime Room
    navigate(`/room/${code}`, {
      state: {
        name: name.trim(),
        roomName: room.room_name,
        isHost: false,
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

        <h1>Join a Room</h1>

        <p className="room-subtitle">
          Enter the room code shared by your friend.
        </p>

        <form onSubmit={handleJoinRoom}>

          <label>Your Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Room Code</label>

          <input
            type="text"
            placeholder="KAIRO-XXXX"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <button
            type="submit"
            className="room-primary-btn"
          >
            Join Room
          </button>

        </form>
      </div>
    </main>
  );
}

export default JoinRoom;