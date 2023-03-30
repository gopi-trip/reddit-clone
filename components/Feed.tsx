import { GET_POSTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React from "react";
import Post from "./Post";

const Feed = () => {
  const { data, error } = useQuery(GET_POSTS);

  const posts: Post[] = data?.postList;
  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post: Post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Feed;
