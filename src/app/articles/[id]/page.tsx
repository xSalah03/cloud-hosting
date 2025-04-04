import { Article } from "@/utils/types";
import React from "react";

interface SingleArticlePageProps {
  params: { id: string };
}

const SingleArticlePage = async ({ params }: SingleArticlePageProps) => {
  const id = params.id;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  const article: Article = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return (
    <section className="fix-height container m-auto w-full px-5 pt-8 md:w-3/4">
      <div className="bg-white p-7 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-700 bb-2">
          {article.title}
        </h1>
        <div className="text-gray-400">1/1/2025</div>
        <p className="text-gray-800 text-xl mt-5">{article.body}</p>
      </div>
    </section>
  );
};

export default SingleArticlePage;
