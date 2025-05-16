export interface Subreddit {
  topic: string;
}

export interface Comment {
  created_at: string;
  id: string;
  post_id: string;
  text: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  image: string;
  username: string;
  created_at: string;
  subreddit: Subreddit[];
  comments: Comment[];
}