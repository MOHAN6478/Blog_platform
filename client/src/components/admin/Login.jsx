import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useAppContext } from "../../context/AppContext";

const Login = () => {

  const { setToken } = useAppContext();

  const [isRegister, setIsRegister] = useState(true); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/register", { name, email, password });

      if (data.success) {
        toast.success("Registered successfully");
        setIsRegister(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.success) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        toast.success("Login successful");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post("/api/auth/google-login", { token: credentialResponse.credential });

      if (data.success) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        toast.success("Google Login Successful");
      }
    } catch (error) {
      toast.error("Google login failed");
      console.log(error.message)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-purple-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-6 text-purple-600">
          {isRegister ? "Admin Register" : "Admin Login"}
        </h1>

        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="space-y-4"
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-all"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>


          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>


        <p className="text-center text-sm mt-6 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-purple-600 cursor-pointer ml-1 font-medium"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;
