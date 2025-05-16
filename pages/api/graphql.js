import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define your GraphQL schema
const typeDefs = gql`
  scalar DateTime

  type Comment {
    id: ID!
    text: String
    username: String
    post_id: ID
    created_at: DateTime
  }

  type Post {
    id: ID!
    title: String
    body: String
    image: String
    username: String
    subreddit_id: ID
    created_at: DateTime
    subreddit: [Subreddit]
    comments: [Comment]
    votes: [Vote]
  }

  type Subreddit {
    id: ID!
    topic: String
    created_at: DateTime
  }

  type Vote {
    id: ID!
    username: String
    post_id: ID
    upvote: Boolean
    created_at: DateTime
  }

  type Query {
    postList: [Post]
    postById(post_id: ID!): Post
    postByTopic(topic: String!): [Post]
    getSubredditListByTopic(topic: String!): [Subreddit]
    getCommentsByPostId(post_id: ID!): [Comment]
  }

  type Mutation {
    insertPost(
      title: String
      body: String
      image: String
      subreddit_id: ID
      username: String
    ): Post
    insertSubreddit(topic: String): Subreddit
    insertComment(
      text: String
      post_id: ID
      username: String
      created_at: DateTime
    ): Comment
  }
`;

// Create the resolvers
const resolvers = {
  Query: {
    postList: async () => {
      return await prisma.post.findMany({
        orderBy: {
          created_at: 'desc',
        },
        include: {
          subreddit: true,
          comments: true,
          votes: true,
        },
      });
    },
    postById: async (_, { post_id }) => {
      return await prisma.post.findUnique({
        where: { id: post_id },
        include: {
          subreddit: true,
          comments: true,
          votes: true,
        },
      });
    },
    postByTopic: async (_, { topic }) => {
      const subreddit = await prisma.subreddit.findFirst({
        where: { topic },
      });
      
      if (!subreddit) return [];
      
      return await prisma.post.findMany({
        where: { subreddit_id: subreddit.id },
        orderBy: { created_at: 'desc' },
        include: {
          subreddit: true,
          comments: true,
          votes: true,
        },
      });
    },
    getSubredditListByTopic: async (_, { topic }) => {
      return await prisma.subreddit.findMany({
        where: { topic },
      });
    },
    getCommentsByPostId: async (_, { post_id }) => {
      return await prisma.comment.findMany({
        where: { post_id },
      });
    },
  },
  Mutation: {
    insertPost: async (_, args) => {
      return await prisma.post.create({
        data: {
          title: args.title,
          body: args.body,
          image: args.image || '',
          subreddit_id: args.subreddit_id,
          username: args.username,
          created_at: new Date(),
        },
      });
    },
    insertSubreddit: async (_, { topic }) => {
      return await prisma.subreddit.create({
        data: {
          topic,
          created_at: new Date(),
        },
      });
    },
    insertComment: async (_, args) => {
      return await prisma.comment.create({
        data: {
          text: args.text,
          post_id: args.post_id,
          username: args.username,
          created_at: new Date(),
        },
      });
    },
  },
  Post: {
    subreddit: async (parent) => {
      return await prisma.subreddit.findMany({
        where: { id: parent.subreddit_id },
      });
    },
    comments: async (parent) => {
      return await prisma.comment.findMany({
        where: { post_id: parent.id },
      });
    },
    votes: async (parent) => {
      return await prisma.vote.findMany({
        where: { post_id: parent.id },
        orderBy: { created_at: 'desc' },
      });
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export the handler
export default startServerAndCreateNextHandler(server);