import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import "../styles/Feed.css"; // ✅ Add your custom CSS file here

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  increment,
  where,
} from "firebase/firestore";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [rants, setRants] = useState([]);
  const [moodFilter, setMoodFilter] = useState(""); // "" means show all
  const navigate = useNavigate();

  useEffect(() => {
    const baseQuery = collection(db, "rants");

    const q = moodFilter
      ? query(baseQuery, where("mood", "==", moodFilter), orderBy("createdAt", "desc"))
      : query(baseQuery, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRants(posts);
    });

    return () => unsubscribe();
  }, [moodFilter]);

  const addReaction = async (rantId, type) => {
    const rantRef = doc(db, "rants", rantId);
    try {
      await updateDoc(rantRef, {
        [`reactions.${type}`]: increment(1),
      });
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  return (
    <div className="feed-container container mt-5">
      <h2 className="feed-title mb-4 text-center">🔥 DevRant</h2>

      {/* Mood Filter UI */}
      <div className="mood-filter d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {["", "💀", "🥲", "😡", "😵‍💫"].map((mood, idx) => (
          <Button
            key={idx}
            variant={moodFilter === mood ? "dark" : "outline-dark"}
            onClick={() => setMoodFilter(mood)}
            className="mood-button"
          >
            {mood || "All"}
          </Button>
        ))}
      </div>

      {rants.map((rant) => (
        <Card
          key={rant.id}
          className="rant-card mb-3 shadow p-3 d-flex flex-row align-items-start gap-3"
        >
          {/* Avatar */}
          <img
            src={rant.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=default"}
            alt="avatar"
            className="rant-avatar"
          />

          <div>
            <Card.Title className="rant-title">
              {rant.isAnonymous ? rant.username : `${rant.username} ${rant.mood}`}
            </Card.Title>

            <Card.Text className="rant-text">{rant.text}</Card.Text>

            {rant.code && (
              <pre className="rant-code bg-dark text-light p-2 rounded">
                <code>{rant.code}</code>
              </pre>
            )}

            <Badge bg="secondary" className="rant-tag">#{rant.tag}</Badge>

            <div className="mt-3 d-flex gap-3 rant-reactions">
              <span onClick={() => addReaction(rant.id, "fire")} className="reaction-btn">
                🔥 {rant.reactions?.fire || 0}
              </span>
              <span onClick={() => addReaction(rant.id, "heartbreak")} className="reaction-btn">
                💔 {rant.reactions?.heartbreak || 0}
              </span>
              <span onClick={() => addReaction(rant.id, "cry")} className="reaction-btn">
                😭 {rant.reactions?.cry || 0}
              </span>
            </div>

            {auth.currentUser?.uid === rant.uid && (
              <button
                className="btn btn-sm btn-outline-primary mt-3 edit-btn"
                onClick={() => navigate(`/edit/${rant.id}`)}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Feed;
