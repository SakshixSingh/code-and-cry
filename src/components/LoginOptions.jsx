import React from 'react';
import { auth, db } from '../firebase/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css"; // Link your custom styles

const LoginOptions = () => {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;
        await setDoc(userRef, {
          username: user.displayName || "Dev",
          avatar: avatarUrl,
          mood: "😵‍💫",
          bio: "",
        });
      }

      navigate('/feed');
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const loginAnonymously = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;

      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=anon-${user.uid}`;
      await setDoc(doc(db, "users", user.uid), {
        username: "Anonymous Dev",
        avatar: avatarUrl,
        mood: "🥷",
        bio: "Incognito coder. No bugs, no fame.",
      });

      navigate('/feed');
    } catch (error) {
      console.error("Anonymous login error:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <button className="login-btn btn btn-primary" onClick={loginWithGoogle}>
          Sign in with Google
        </button>
        <button className="login-btn btn btn-outline-light" onClick={loginAnonymously}>
          Continue Anonymously
        </button>
      </div>
    </div>
  );
};

export default LoginOptions;
