import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ isAdmin, isLoggedIn,user }) => {
  const defaultProfileImage = "/user.png"; 
    
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Use Authorization header instead of cookies
        },
        // ✅ Remove credentials: "include" - not needed for localStorage
      });

      // ✅ Always remove token from localStorage, regardless of response
      localStorage.removeItem('authToken');
      
      if (response.ok) {
        console.log("Logout successful");
        // ✅ Redirect to login page
        window.location.href = "/login"; // Use this instead of navigate if you don't have useNavigate
      } else {
        console.log("Logout request failed, but token removed locally");
        window.location.href = "/login"; // Still redirect even if server request fails
      }
    } catch (error) {
      console.error("Logout error: ", error);
      // ✅ Even if logout fails, remove token and redirect
      localStorage.removeItem('authToken');
      window.location.href = "/login";
    }
  };
  return (
    <nav className="flex justify-between text-amber-50 py-4 w-full sticky-top bg-amber-900">
      <div className="logo">
        <span className="font-bold text-3xl mx-9 my-2">E-Library</span>
      </div>
      <ul className="flex gap-8 mx-9">
        <NavLink
          className={(e) => {
            return e.isActive ? "font-bold" : "";
          }}
          to="/"
        >
          <li className="cursor-pointer hover:font-bold transition-all duration-75 text-2xl mr-4">
            Home
          </li>
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/new"
            className={(e) => {
              return e.isActive ? "font-bold" : "";
            }}
          >
            <li className="cursor-pointer hover:font-bold transition-all duration-75 text-2xl mr-4">
              Add Books
            </li>
          </NavLink>
        )}

        <NavLink
          to="/account"
          className={(e) => {
            return e.isActive ? "font-bold" : "";
          }}
        >
          <li className="cursor-pointer hover:font-bold transition-all duration-75 text-2xl mr-4">
            My Account
          </li>
        </NavLink>

        {!isLoggedIn ? <NavLink
            to="/login"
            className={(e) => {
              return e.isActive ? "font-bold" : "";
            }}
          >
            <li className="cursor-pointer hover:font-bold transition-all duration-75 text-2xl mr-4">
              Log In
            </li>
          </NavLink>
          :
          <div className="flex justify-center">
              <img
                src={
                  user.photo
                    ? `data:${user.photo.contentType};base64,${user.photo.imageBase64}`
                    : defaultProfileImage
                }
                alt="Profile"
                className="rounded-full w-12 h-12 mt-0 object-contain"
              />
            </div>
}
      </ul>
    </nav>
  );
};

export default Navbar;
