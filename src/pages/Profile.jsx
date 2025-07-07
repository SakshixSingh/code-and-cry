import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";

const Profile = () => {
  const [myRants, setMyRants] = useState([]);
  const [moodStats, setMoodStats] = useState({});
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  // 🔹 Fetch rants
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "rants"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rants = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyRants(rants);

      const moodCount = {};
      rants.forEach((r) => {
        if (r.mood) {
          moodCount[r.mood] = (moodCount[r.mood] || 0) + 1;
        }
      });
      setMoodStats(moodCount);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔹 Fetch profile data
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };
    fetchUser();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const getTopMood = () => {
    const entries = Object.entries(moodStats);
    if (entries.length === 0) return "😐";
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👤 Your Profile</h2>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Avatar + Bio */}
      {userData && (
        <div className="text-center mb-4">
          <img
            src={userData.avatar}
            alt="avatar"
            className="rounded-circle mb-2"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <h4>{userData.username} {userData.mood}</h4>
          <p className="text-muted">{userData.bio || "No bio yet"}</p>
        </div>
      )}

      <h5>Your Dev Mood: <span style={{ fontSize: "1.5rem" }}>{getTopMood()}</span></h5>
      <p className="text-muted mb-4">You’ve posted {myRants.length} rant(s)</p>

      {/* Rants */}
      {myRants.map((rant) => (
        <Card key={rant.id} className="mb-3">
          <Card.Body>
            <Card.Title>
              {rant.isAnonymous ? "Anonymous 🥷" : `${rant.username} ${rant.mood}`}
            </Card.Title>
            <Card.Text>{rant.text}</Card.Text>
            {rant.code && (
              <pre className="bg-dark text-light p-2 rounded">
                <code>{rant.code}</code>
              </pre>
            )}
            <Badge bg="info">#{rant.tag}</Badge>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Profile;
