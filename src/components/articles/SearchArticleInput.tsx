"use client";
import { useRouter } from "next/router";
import React, { useState } from "react";

const SearchArticleInput = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ searchText });
    router.push(`/articles/search?searchText=${searchText}`);
  };

  return (
    <form onSubmit={formSubmitHandler} className="my-5 w-full md:w-2/3 m-auto">
      <input
        className="w-full p-3 bg-white rounded text-xl border-none text-gray-900"
        type="search"
        placeholder="Search for article"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </form>
  );
};

export default SearchArticleInput;
