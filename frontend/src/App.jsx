import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Books from "./components/Books";
import Edit from "./components/Edit";
import New from "./components/New";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Issue from "./components/Issue";

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Fetch user data to determine if user is admin and if logged in
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/userData", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
        });
        if (response.ok) {
          const user = await response.json();
          setIsAdmin(user.role === "admin"); // Set isAdmin based on user role
          setIsLoggedIn(true); // User is logged in if data fetch is successful
          console.log(user.photo);
          setUser(user) 
        } else {
          setIsLoggedIn(false); // User is not logged in if fetch fails or user data not found
          setIsAdmin(false); // Reset isAdmin state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false); // Set isLoggedIn to false on error
        setIsAdmin(false); // Reset isAdmin state on error
      }
    };
    fetchUserData();
  }, []);

  return (
    <Router>
      <div>
        <Navbar isAdmin={isAdmin} isLoggedIn={isLoggedIn} user={user} />
        <Routes>
          <Route path="/" element={<Books isAdmin={isAdmin} />} />
          <Route path="/new" element={<New />} />
          <Route path="/:id" element={<Edit />} />
          <Route path="/:id/issue" element={<Issue />} />
          <Route path="/account" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
