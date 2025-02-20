// pages/LoadingScreen.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/galaxy_match_logo.png";

function LoadingScreen() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
        navigate("/home"); // Redirect to home page after 5 seconds
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timeout
    }, [navigate]);

    return (
        <div className="loading-container">
        <img src={logo} alt="Game Logo" className="loading-logo" />
        </div>
    );
}

export default LoadingScreen;
