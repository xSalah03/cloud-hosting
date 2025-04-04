import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form className="flex flex-col" action="">
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="email"
        placeholder="Enter Your Email"
      />
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="password"
        placeholder="Enter Your Password"
      />
      <button
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
