import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $title: String!
    $body: String!
    $image: String!
    $subreddit_id: ID!
    $username: String!
  ) {
    insertPost(
      title: $title
      body: $body
      image: $image
      subreddit_id: $subreddit_id
      username: $username
    ) {
      id
      title
      body
      image
      subreddit_id
      username
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const ADD_COMMENT = gql`
 mutation MyMutation(
  $username:String
  $post_id:ID
  $text: String
  $created_at:DateTime
 ){
  insertComment(
    username:$username
    post_id:$post_id
    text:$text
    created_at:$created_at
  ){
    id
    text
    username
    post_id
  }
 }
`;
