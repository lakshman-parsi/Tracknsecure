import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [istogg, settogg] = useState(false);
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  function onchangehandle(e) {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  }

  async function onhandlesubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email: data.email,
        password: data.password,
      });

      const { token, username, id } = response.data;
      const { access, refresh } = token;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", id);

      toast.success(`Welcome, ${username}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center px-4 pt-6 overflow-auto">
      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-2xl px-8 py-10 w-full max-w-sm border border-white/40">
        <h1 className="text-3xl font-extrabold text-center text-pink-700 mb-3 tracking-wide">
          track N secure
        </h1>
        <p className="text-center text-gray-700 mb-6 text-sm">
          TRACK THE THREAT SECURE THE JOURNEY
        </p>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-5">
          Login
        </h2>
        <form onSubmit={onhandlesubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 hover:text-pink-500 transition">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={onchangehandle}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 hover:text-pink-500 transition">
              Password
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
              <input
                type={istogg ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={onchangehandle}
                required
                placeholder="Enter your password"
                className="w-full py-2 outline-none bg-transparent"
              />
              <div
                className="cursor-pointer text-gray-600 hover:text-pink-500 transition"
                onClick={() => settogg(!istogg)}
              >
                {istogg ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>
          <div className="text-right mb-5">
            <Link
              to="/forgotpassword"
              className="text-sm text-blue-600 hover:text-pink-500 transition"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition-all"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
