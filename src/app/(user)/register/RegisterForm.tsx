import React, { useState } from "react";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "") return toast.error("Please enter your username");
    if (email === "") return toast.error("Please enter your email");
    if (password === "") return toast.error("Please enter your password");
    console.log({ username, email, password });
  };

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col" action="">
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="username"
        placeholder="Enter Your Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="email"
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="password"
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
        type="submit"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
