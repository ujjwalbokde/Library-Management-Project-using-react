import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies along with the request
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        setError(null); // Clear error on successful login
        window.location.href="/"

      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to login. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again later.");
    }
  };

  return (
    <div className="text-center mx-[32%] my-[6%] text-amber-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[30px] p-4 pt-8 px-0 w-[500px] h-[380px] border-2 border-amber-900 bg-amber-200"
      >
        <h1 className="text-center text-3xl mb-8 mt-2 font-bold">Login</h1>
        <input
          type="email"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Email"
          {...register("email", {
            required: "This field is required",
          })}
        />
        {errors.email ? (
          <div className="text-red-600">{errors.email.message}</div>
        ) : (
          <br />
        )}
        <br />
        <input
          type="password"
          className="border border-black rounded-md p-1 mb-2 w-60"
          placeholder="Password"
          {...register("password", {
            required: "This field is required",
            minLength: { value: 6, message: "Password is too short" },
            maxLength: { value: 20, message: "Password is too long" },
          })}
        />
        {errors.password ? (
          <div className="text-red-600">{errors.password.message}</div>
        ) : (
          <br />
        )}
        <br />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          type="submit"
          className="border-2 border-amber-900 rounded-md bg-amber-900 text-white p-1 px-2 mb-2"
          value="Login"
        />
        <p className="mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="underline">
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
