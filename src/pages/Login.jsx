// pages/Login.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // New username field
    const [error, setError] = useState(""); // Error message state
    const navigate = useNavigate();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigate("/home"))
            .catch((error) => setError(error.message));
    };

    const handleRegister = async () => {
        if (!username.trim()) {
            setError("Please enter a username!");
            return;
        }

        try {
            // ✅ Step 1: Check if the username already exists in "Users/"
            const usersRef = ref(db, "Users");
            const usernameQuery = query(usersRef, orderByChild("pseudo"), equalTo(username));

            const snapshot = await get(usernameQuery);
            if (snapshot.exists()) {
                setError("Username already exists! Please choose a different one.");
                return;
            }

            // ✅ Step 2: Create new user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Step 3: Save user data in "Users/"
            await set(ref(db, `Users/${user.uid}`), {
                pseudo: username,
                email: user.email
            });

            navigate("/home"); // Redirect to home page
        } catch (error) {
            setError(error.message);
        }
    };




    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="Username (only for registration)" onChange={(e) => setUsername(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Login;
