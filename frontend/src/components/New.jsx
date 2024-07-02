import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const New = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Destructuring reset method for form reset
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      let response = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Books added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding books:", error);
    }
  };

  return (
    <div className="text-center mx-[32%] my-[6%] text-amber-900">
      <form
        className="rounded-[30px] p-4 pt-8 px-0 w-[500px] h-[350px] border-2 border-amber-900 bg-amber-200"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-3xl mb-8 mt-2 font-bold">
          Add Book here!
        </h1>
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Book Name"
          {...register("name", {
            required: "This field is required",
            minLength: { value: 3, message: "Name is too small" },
          })}
        />
        {errors.name ? (
          <div className="text-red-600">{errors.name.message}</div>
        ) : (
          <br />
        )}
        <br />
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Author Name"
          {...register("author", {
            required: "This field is required",
            minLength: { value: 3, message: "Author name is too small" },
          })}
        />
        {errors.author ? (
          <div className="text-red-600">{errors.author.message}</div>
        ) : (
          <br />
        )}
        <br />
        <input
          type="text"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Image URL"
          {...register("imageLink")}
        />
        <br />
        <input
          type="submit"
          className="border-2 border-amber-900 rounded-md bg-amber-900 text-white p-1 px-2 mt-2"
          value="Add"
        />
      </form>
    </div>
  );
};

export default New;
