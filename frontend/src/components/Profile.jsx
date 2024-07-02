import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const defaultProfileImage = "/user.png"; // Path to your default profile image

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [photo, setPhoto] = useState(null);

  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:8080/userData", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials if needed
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setUser(result);
    } catch (err) {
      console.error("Fetch user data error: ", err);
      setError(err.message);
    }
  };

  const getBookData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/account/issued-books`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials if needed (e.g., cookies)
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setBooks(result);
    } catch (err) {
      console.error("Fetch book data error: ", err);
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]); // Update selected file state
  };

  const handleReturnBook = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/account/issued-books/${id}/return`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        // Book returned successfully, update state or fetch updated data
        getBookData();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Return book error: ", error);
    }
  };

  useEffect(() => {
    getUserData();
    getBookData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        setIsLoggedOut(true);
        // navigate("/login");
        window.location.href = "/login";
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };
  const handleUpload = async () => {
    if (!photo) {
      console.error("No file selected.");
      return;
    }
  
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("userId", user._id); // Include the user ID in the form data
  
    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
  
      const data = await response.json();
      console.log(data);
  
      // Update the user's photo in the state
      setUser((prevUser) => ({
        ...prevUser,
        photo: {
          contentType: "image/jpeg", // Adjust the content type if needed
          imageBase64: photo.base64,
        },
      }));
      window.location.href="/account"
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };
  

  return (
    <div>
      <div className="border-2 w-[50%] mx-[24%] mt-5 border-amber-900 bg-yellow-200 rounded-4 p-2">
        <h1 className="text-center pt-3 text-3xl font-bold ">PROFILE</h1>
        {isLoggedOut || !user ? (
          <div>
            <p className="text-red-600 mx-4">No Data found!</p>
            <Link to="/signup">
              <button className="mx-4 text-amber-900 font-bold text-xl mt-2">
                SignUp
              </button>
            </Link>
            <Link to="/login">
              <button className="mx-4 text-amber-900 font-bold text-xl mb-2">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <img
                src={
                  user.photo
                    ? `data:${user.photo.contentType};base64,${user.photo.imageBase64}`
                    : defaultProfileImage
                }
                alt="Profile"
                className="rounded-full w-48 h-48 mt-0 object-contain"
              />
            </div>
            <div className="mx-10 mb-4">
              <h1 className="text-xl mb-1 mt-3 font-bold">
                Change your profile photo
              </h1>
              <input type="file" onChange={handleFileChange} />
              <button
                onClick={handleUpload}
                className="border-2 border-amber-900 rounded-md p-1"
              >
                Upload
              </button>
            </div>
            <h1 className="text-xl mx-10">
              Username : <b> {user.username}</b>
            </h1>
            <h1 className="text-xl mx-10">
              Email : <b>{user.email}</b>
            </h1>

            {books.length > 0 ? (
              <div className="mt-4">
                <h2 className="font-bold text-2xl mx-10">Issued Books:</h2>
                <ul className="row">
                  {books.map((book) => (
                    <li
                      key={book._id}
                      className="card p-2 w-64 mx-14 mb-1 mt-2 bg-amber-200 border-2 border-amber-900"
                    >
                      <p>Name: {book.name}</p>
                      <p>Author: {book.author}</p>
                      <button
                        className="border-2 border-amber-900 w-16 mt-1 mx-20"
                        onClick={() => handleReturnBook(book._id)}
                      >
                        Return
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 mx-10">No books issued yet.</p>
            )}
            <button
              className="text-xl text-center mt-4 p-1 rounded-md mb-3 mx-[44%] border-2 border-amber-900"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
