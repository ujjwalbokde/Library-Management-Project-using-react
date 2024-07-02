import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      if (response.status === 200) {
        navigate("/login");
      } else {
        setError(responseData.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Failed to signup. Please try again later.");
    }
  };

  return (
    <div className="text-center mx-[32%] my-[6%] text-amber-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[30px] p-4 pt-8 px-0 w-[500px] h-[480px] border-2 border-amber-900 bg-amber-200"
      >
        <h1 className="text-center text-3xl mb-8 mt-2 font-bold">Sign Up!</h1>

        <input
          type="text"
          placeholder="Username"
          className="border border-black rounded-md p-1 mb-2 w-60"
          {...register("username", {
            required: "This field is required",
            minLength: { value: 3, message: "Username is too short" },
            maxLength: { value: 10, message: "Username is too long" },
          })}
        />
        {errors.username ? (
          <div className="text-red-600">{errors.username.message}</div>
        ):<br/>}
        <br />

        <input
          type="email"
          placeholder="Email"
          className="border border-black rounded-md p-1 mb-2 w-60"
          {...register("email", {
            required: "This field is required",
          })}
        />
        {errors.email ? (
          <div className="text-red-600">{errors.email.message}</div>
        ):<br/>}
        <br />

        <input
          type="password"
          placeholder="Password"
          className="border border-black rounded-md p-1 mb-2 w-60"
          {...register("password", {
            required: "This field is required",
            minLength: { value: 6, message: "Password is too short" },
            maxLength: { value: 20, message: "Password is too long" },
          })}
        />
        {errors.password ?(
          <div className="text-red-600">{errors.password.message}</div>
        ):<br/>}
        <br />

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <input
          type="submit"
          className="border-2 border-amber-900 rounded-md bg-amber-900 text-white p-1 px-2 mb-2"
          value="SignUp"
        />
        <p className="mt-2">Have an account? <Link to="/login" className="underline">Login</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
