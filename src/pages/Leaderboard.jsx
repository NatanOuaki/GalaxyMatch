// pages/Leaderboard.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function Leaderboard() {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const scoresRef = ref(db, "Leaderboard");
        onValue(scoresRef, (snapshot) => {
        const data = snapshot.val();
        setScores(Object.values(data || {}).sort((a, b) => a.time - b.time));
        });
    }, []);

    return (
        <div className="leaderboard-container">
        <h1>Leaderboard</h1>
        {scores.map((score, index) => (
            <p key={index}>{index + 1}. {score.pseudo} - {score.time}s</p>
        ))}
        </div>
    );
}

export default Leaderboard;
