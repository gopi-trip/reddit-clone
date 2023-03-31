import { GET_POSTS, GET_POSTS_BY_TOPIC } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React from "react";
import Post from "./Post";

type props = {
  topic?: string;
};

const Feed = ({ topic }: props) => {
  const { data, error } = topic
    ? useQuery(GET_POSTS_BY_TOPIC, {
        variables: {
          topic: topic,
        },
      })
    : useQuery(GET_POSTS);

  console.log(data, error?.cause);

  const posts: Post[] = topic ? data?.postByTopic : data?.postList;
  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post: Post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Feed;
