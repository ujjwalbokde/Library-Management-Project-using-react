import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const Issue = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [book, setBook] = useState({ name: '', author: '' });
  const [user, setUser] = useState({ username: '', email: '' });
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate=useNavigate()

  // Fetch book data by ID
  const getBookData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/${id}/issue`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setBook(result);
      setValue('book', result.name); // Set form value for book name
      setValue('author', result.author); // Set form value for author name
    } catch (err) {
      console.error('Fetch book data error: ', err);
      setError(err.message);
    }
  };

  // Fetch user data
  const getUserData = async () => {
    try {
        const response = await fetch("http://localhost:8080/userData", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include" // Include credentials if needed
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setUser(result);
        setValue("username",result.username)
        setValue("email",result.email)
      } catch (err) {
        console.error("Fetch error: ", err);
        setError(err.message);
      }
  };

  useEffect(() => {
    getBookData();
    getUserData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:8080/${id}/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         credentials: 'include',
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate("/")
        console.log('Book issued successfully');
        // Redirect or perform necessary action upon successful issue
      } else {
        setError("Failed to issue book")
      }
    } catch (err) {
      console.error('Issue book error: ', err);
    }
  };

  return (
    <div className="text-center mx-[32%] my-[6%]">
      <form
        className="rounded-[30px] p-4 pt-8 px-0 w-[500px] h-[350px] bg-amber-200 border-2 border-amber-900"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-3xl mb-8 mt-2 font-bold text-amber-900">
          Issue your book here!
        </h1>
        Username :{' '}
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          value={user.username}
          {...register('username')}
        />
        <br />
        Book Name :{' '}
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          value={book.name}
          {...register('book')}
        />
        <br />
        Author Name :{' '}
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          value={book.author}
          {...register('author')}
        />
        <br />
        Email :{' '}
        <input
          type="email"
          className="border border-black rounded-md p-1 mb-2 w-60"
          value={user.email}
          {...register('email')}
        />
        <br />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          type="submit"
          className="border border-white rounded-md bg-amber-900 text-white p-1 px-2 mt-2"
          value="Issue"
        />
      </form>
    </div>
  );
};

export default Issue;
