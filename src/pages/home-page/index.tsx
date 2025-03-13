"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { onLogin } from "@/lib/features/authSlice";
import axios from "axios";
import { setCookie } from "cookies-next";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5001/users", {
        email,
        password,
      });
      dispatch(onLogin(response.data));
      setCookie("user", response.data);
      router.push("/post");
    } catch (error) {
      console.log("Login failed", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-500">
      <div className="m-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/logo-1.png"
            alt="Chick-X Logo"
            width={100}
            height={100}
          />
          <h1 className="text-3xl">Chick-X</h1>
        </div>
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white p-2 rounded mb-2"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-green-500 text-white p-2 rounded"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
