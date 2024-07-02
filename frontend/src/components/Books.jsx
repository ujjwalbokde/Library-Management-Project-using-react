import React, { useEffect, useState } from "react";

const Books = ({ isAdmin }) => {
  const [books, setBooks] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:8080", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Include credentials (cookies)
      });
      const result = await response.json();
      setBooks(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
        credentials: "include", // Include credentials (cookies)
      });
      if (response.ok) {
        getData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-3">
      <div className="mx-20">
        <div className="row">
          {books.map((book) => (
            <div
              key={book._id}
              className="card m-2 border-2 border-amber-600 bg-amber-200 p-3 rounded-lg text-amber-900"
              style={{ width: "20rem" }}
            >
              <div className="card-body">
                <img src={book.imageLink} alt="" className="mb-3 w-full object-contain h-64"/>
                <h5 style={{ textAlign: "start" }} className="card-title">
                  Book Name : <b>{book.name}</b>
                </h5>
                <h3 className="card-text">
                  Author name : <b>{book.author}</b>
                </h3>
                <div className="btn-div flex mt-3">
                  {isAdmin ? (
                    <>
                      <form method="get" action={`/${book._id}`}>
                        <button className="rounded-md">
                          Edit
                          <br /><i className="fa-solid fa-pen-to-square text-xl"></i>
                        </button>
                      </form>
                      <button
                        className="mx-3 rounded-md"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                        <br /><i className="fa-solid fa-trash text-xl"></i>
                      </button>
                    </>
                  ) : (
                    <form method="get" action={`/${book._id}/issue`}>
                      <button className="border-2 border-amber-900 p-1 rounded-md">Issue Book</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
