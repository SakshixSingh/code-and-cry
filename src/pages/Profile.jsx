import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { Card, Button } from "react-bootstrap";
import "../styles/Feed.css"; // Uses dark mode styling

function Profile() {
  const [rants, setRants] = useState([]);
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const rantsRef = collection(db, "rants");
        const q = query(rantsRef, where("userId", "==", currentUser.uid));

        const unsubscribeRants = onSnapshot(q, (snapshot) => {
          const rantList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRants(rantList);
        }, (error) => {
          console.error("Error fetching rants:", error);
        });

        return () => {
          unsubscribeRants();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [auth, db]);

  if (!user) {
    return <div className="text-light">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-light mb-4">Welcome, {user.displayName || "Coder"} 👋</h2>
      <div className="row">
        {rants.length > 0 ? (
          rants.map((rant) => (
            <div className="col-md-6 mb-4" key={rant.id}>
              <Card className="rant-card p-3 shadow">
                <Card.Body>
                  <Card.Title className="rant-title">{rant.title}</Card.Title>
                  <Card.Text className="rant-text">{rant.text}</Card.Text>
                  {rant.code && (
                    <pre className="rant-code mt-2 p-2 rounded">
                      <code>{rant.code}</code>
                    </pre>
                  )}
                  <div className="mt-2">
                    <span className="rant-tag badge me-2">{rant.mood}</span>
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      Posted on {new Date(rant.timestamp?.toDate()).toLocaleString()}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-light">No rants yet. Go cry some code 😢.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
