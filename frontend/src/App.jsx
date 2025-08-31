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
      // ✅ Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      // ✅ If no token, user is not logged in
      if (!token) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
        return;
      }

      const response = await fetch("http://localhost:8080/userData", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` // ✅ Use Authorization header instead of cookies
        },
        // ✅ Remove credentials: "include" - not needed for localStorage
      });

      if (response.ok) {
        const user = await response.json();
        setIsAdmin(user.role === "admin"); // Set isAdmin based on user role
        setIsLoggedIn(true); // User is logged in if data fetch is successful
        console.log(user.photo);
        setUser(user);
      } else if (response.status === 401 || response.status === 403) {
        // ✅ Token is invalid or expired, remove it
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
      } else {
        setIsLoggedIn(false); // User is not logged in if fetch fails
        setIsAdmin(false); // Reset isAdmin state
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // ✅ On error, also check if we should clear invalid token
      localStorage.removeItem('authToken');
      setIsLoggedIn(false); // Set isLoggedIn to false on error
      setIsAdmin(false); // Reset isAdmin state on error
      setUser(null);
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
