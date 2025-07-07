import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [rants, setRants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "rants"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRants(posts);
    });

    return () => unsubscribe();
  }, []);

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
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🔥 Code & Cry Feed</h2>

      {rants.map((rant) => (
        <Card key={rant.id} className="mb-3 shadow p-3 d-flex flex-row align-items-start gap-3">
          {/* 🔥 Avatar */}
          <img
            src={rant.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=default"}
            alt="avatar"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div>
            <Card.Title>
              {rant.isAnonymous ? rant.username : `${rant.username} ${rant.mood}`}
            </Card.Title>

            <Card.Text>{rant.text}</Card.Text>

            {rant.code && (
              <pre className="bg-dark text-light p-2 rounded">
                <code>{rant.code}</code>
              </pre>
            )}

            <Badge bg="secondary">#{rant.tag}</Badge>

            <div className="mt-3 d-flex gap-3">
              <span onClick={() => addReaction(rant.id, "fire")} style={{ cursor: "pointer" }}>
                🔥 {rant.reactions?.fire || 0}
              </span>
              <span onClick={() => addReaction(rant.id, "heartbreak")} style={{ cursor: "pointer" }}>
                💔 {rant.reactions?.heartbreak || 0}
              </span>
              <span onClick={() => addReaction(rant.id, "cry")} style={{ cursor: "pointer" }}>
                😭 {rant.reactions?.cry || 0}
              </span>
            </div>

            {auth.currentUser?.uid === rant.uid && (
              <button
                className="btn btn-sm btn-outline-primary mt-3"
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
