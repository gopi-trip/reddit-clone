import React, { useEffect, useState } from "react";
import Post from "./Post";
import supabase from "@/lib/supabaseClient.js";

type props = {
  topic?: string;
};

const Feed = ({ topic }: props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        if (!topic) {
          // Fetch all posts
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              subreddit:subreddits(*),
              comments:comments(*),
              votes:votes(*)
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          setPosts(data);
        } else {
          // Fetch posts by topic
          const { data: subredditData, error: subredditError } = await supabase
            .from('subreddits')
            .select('id')
            .eq('topic', topic)
            .single();
            
          if (subredditError) throw subredditError;
          
          const { data, error } = await supabase
            .from('posts')
            .select(`
              *,
              subreddit:subreddits(*),
              comments:comments(*),
              votes:votes(*)
            `)
            .eq('subreddit_id', subredditData.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [topic]);

  if (loading) return <div className="flex w-full items-center justify-center p-10 text-xl">Loading...</div>;
  if (error) return <div className="flex w-full items-center justify-center p-10 text-xl">Error loading posts</div>;

  return (
    <div className="mt-5 space-y-4">
      {posts?.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Feed;