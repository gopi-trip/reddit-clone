import { GET_POSTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React from "react";

const Feed = () => {
  const { data, error } = useQuery(GET_POSTS);
  return <div>Feed</div>;
};

export default Feed;
