export type Post = {
  id: string;
  title: string;
  body?: string;
  image?: string;
  username: string;
  subreddit_id: string;
  created_at: string;
  subreddit: {
    id: string;
    topic: string;
    created_at: string;
  }[];
  comments: {
    id: string;
    text: string;
    username: string;
    post_id: string;
    created_at: string;
  }[];
  votes: {
    id: string;
    username: string;
    post_id: string;
    upvote: boolean;
    created_at: string;
  }[];
};