import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PostRant = () => {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [mood, setMood] = useState("🥲");
  const [tag, setTag] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const user = auth.currentUser;

    const rantData = {
      text,
      code,
      mood,
      tag,
      isAnonymous,
      createdAt: serverTimestamp(),
      uid: user?.uid || null,
      username: isAnonymous ? null : user?.displayName || "Anonymous",
    };

    try {
      await addDoc(collection(db, "rants"), rantData);
      navigate("/feed");
    } catch (error) {
      console.error("Error posting rant:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📝 Drop Your Rant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Rant Text</label>
          <textarea
            className="form-control"
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Code Snippet (optional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Mood</label>
          <select
            className="form-select"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="🥲">🥲 Sad</option>
            <option value="💀">💀 Dead Inside</option>
            <option value="😵‍💫">😵‍💫 Stressed</option>
            <option value="😡">😡 Angry</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Tag</label>
          <select
            className="form-select"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="general">#general</option>
            <option value="frontend">#frontend</option>
            <option value="backend">#backend</option>
            <option value="css">#css</option>
            <option value="bug">#bug</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
            id="anonCheck"
          />
          <label className="form-check-label" htmlFor="anonCheck">
            Post Anonymously
          </label>
        </div>

        <button type="submit" className="btn btn-danger">
          🚀 Post Rant
        </button>
      </form>
    </div>
  );
};

export default PostRant;
