// pages/Game.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

// Import images
import card1 from "../assets/card1.png";
import card2 from "../assets/card2.png";
import card3 from "../assets/card3.png";
import card4 from "../assets/card4.png";
import card5 from "../assets/card5.png";
import card6 from "../assets/card6.png";
import card7 from "../assets/card7.png";
import card8 from "../assets/card8.png";
import card9 from "../assets/card9.png";
import card10 from "../assets/card10.png";
import card11 from "../assets/card11.png";
import card12 from "../assets/card12.png";
import card13 from "../assets/card13.png";
import card14 from "../assets/card14.png";
import card15 from "../assets/card15.png";
import card16 from "../assets/card16.png";
import card17 from "../assets/card17.png";
import card18 from "../assets/card18.png";
import card19 from "../assets/card19.png";
import card20 from "../assets/card20.png";
import cardBack from "../assets/card_back.png";

// All available cards
const allCards = [
    card1, card2, card3, card4, card5, card6, card7, card8, card9, card10,
    card11, card12, card13, card14, card15, card16, card17, card18, card19, card20
];

// Preload images function
const preloadImages = (images) => {
    return Promise.all(
        images.map((image) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = image;
                img.onload = resolve;
                img.onerror = reject;
            });
        })
    );
};

// Function to randomly pick 8 pairs (16 cards total)
function selectRandomPairs() {
    let shuffled = [...allCards].sort(() => Math.random() - 0.5); // Shuffle
    let selectedCards = shuffled.slice(0, 8); // Pick 8 unique cards
    return [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5); // Duplicate & shuffle again
}

function Game() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Preload images before game starts
        preloadImages([...allCards, cardBack]).then(() => {
            setCards(selectRandomPairs());
            setIsRunning(true);
            setLoading(false); // Hide loading screen once images are preloaded
        });
    }, []);

    useEffect(() => {
        if (isRunning && !isPaused) {
            const interval = setInterval(() => setTimer((t) => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, isPaused]);

    function handleCardClick(index) {
        if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
            setFlipped([...flipped, index]);
        }
        if (flipped.length === 1) {
            setTimeout(() => checkMatch(flipped[0], index), 800);
        }
    }

    function checkMatch(first, second) {
        if (cards[first] === cards[second]) {
            setMatched([...matched, first, second]);
            if (matched.length + 2 === cards.length) {
                setIsRunning(false);
                saveBestScore(timer); // Save best score to Firebase
                alert(`🎉 You won in ${timer} seconds!`);
            }
        }
        setFlipped([]);
    }

    function saveBestScore(time) {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = ref(db, `Users/${user.uid}`); // Reference to user data
        const userScoreRef = ref(db, `Leaderboard/${user.uid}`); // Reference to leaderboard data

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const pseudo = snapshot.val().pseudo || "Player"; // Fetch pseudo from database

                get(userScoreRef).then((scoreSnapshot) => {
                    let bestTime = scoreSnapshot.exists() ? scoreSnapshot.val().time : Infinity;
                    if (time < bestTime) {
                        set(userScoreRef, { pseudo, time }); // Save best time with correct pseudo
                    }
                });
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });
    }

    // Pause the game
    function handlePause() {
        setIsPaused(true);
    }

    // Resume the game
    function handleResume() {
        setIsPaused(false);
    }

    // Restart the game
    function handleRestart() {
        window.location.reload();
    }

    return (
        <div className="game-container">
            {/* Show loading screen before game starts */}
            {loading ? (
                <div className="loading-screen">
                    <h2>🚀 Loading Game...</h2>
                </div>
            ) : (
                <>
                    <div className="game-header">
                        <h1>⏳ Time: {timer}s</h1>
                        <button onClick={handlePause} className="pause-button">⏸</button>
                    </div>
                    <div className="grid">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`card ${flipped.includes(index) || matched.includes(index) ? "flipped" : ""}`}
                                onClick={() => handleCardClick(index)}
                            >
                                {flipped.includes(index) || matched.includes(index) ? (
                                    <img src={card} alt="Game Card" width="120" loading="eager" />
                                ) : (
                                    <img src={cardBack} alt="Game Card" width="120" loading="lazy" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pause Modal */}
                    {isPaused && (
                        <div className="pause-modal">
                            <div className="pause-content">
                                <button onClick={handleResume}>▶ Resume</button>
                                <button onClick={handleRestart}>🔄 Restart</button>
                                <button onClick={() => navigate("/")}>🏠 Go Home</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Game;
