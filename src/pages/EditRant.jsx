import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const EditRant = () => {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [tag, setTag] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRant = async () => {
      const docRef = doc(db, "rants", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const rant = docSnap.data();
        setText(rant.text || "");
        setCode(rant.code || "");
        setTag(rant.tag || "");
      }
    };
    fetchRant();
  }, [id]);

  const handleUpdate = async () => {
    const rantRef = doc(db, "rants", id);
    await updateDoc(rantRef, {
      text,
      code,
      tag,
    });
    navigate("/feed");
  };

  return (
    <div className="container mt-5">
      <h2>Edit Your Rant 🖊️</h2>
      <div className="mb-3">
        <label>Text</label>
        <textarea
          className="form-control"
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label>Code (optional)</label>
        <textarea
          className="form-control"
          rows="3"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label>Tag</label>
        <input
          className="form-control"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>
      <button className="btn btn-success" onClick={handleUpdate}>
        ✅ Update Rant
      </button>
    </div>
  );
};

export default EditRant;
