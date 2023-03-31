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
      subreddit {
        created_at
        id
        topic
      }
      comments {
        created_at
        id
        post_id
        text
        username
      }
      votes {
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

export const GET_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    postByTopic(topic: $topic) {
      id
      title
      body
      image
      created_at
      subreddit_id
      username
      subreddit {
        created_at
        id
        topic
      }
      comments {
        created_at
        id
        post_id
        text
        username
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query MyQuery($id: ID!) {
    postById(post_id: $id) {
      title
      body
      image
      created_at
      subreddit_id
      username
      subreddit {
        created_at
        id
        topic
      }
      comments {
        created_at
        id
        post_id
        text
        username
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
    }
  }
`;

export const GET_COMMENTS_BY_POST_ID = gql`
  query MyQuery($id: ID!) {
    getCommentsByPostId(post_id: $id) {
      id
      text
      username
      post_id
    }
  }
`;
