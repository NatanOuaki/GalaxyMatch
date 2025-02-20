import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

function Home() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(db, `Users/${user.uid}`);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        setUsername(snapshot.val().pseudo || "Player");
                    }
                    setLoading(false);
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = () => {
        signOut(auth).then(() => navigate("/login"));
    };

    return (
        <div className="home-container">
            {loading ? (
                <></>
            ) : (
                <>
                    <h1>Welcome, {username} 👋</h1>
                    <div className="btn-home-container">
                        <button onClick={() => navigate("/game")}>Start Game</button>
                        <button onClick={() => navigate("/leaderboard")}>View Leaderboard</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
