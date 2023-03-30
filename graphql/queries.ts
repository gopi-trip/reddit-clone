import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query MyQuery {
    postList {
      id
      title
      body
      image
      created_at
      subreddit_id
      username
      subreddit:{
        created_at
        id
        topic
      }
      comments:{
        created_at
        id
        post_id
        text
        username
      }
      vote:{
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
