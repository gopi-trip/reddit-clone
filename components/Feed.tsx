import React, { useEffect, useState } from "react";
import Post from "./Post";
import supabase from "@/lib/supabaseClient.js";
import { Post as PostType } from "../types/Post";

type props = {
  topic?: string;
};

const Feed = ({ topic }: props) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Clear previous errors when topic changes
    setError(null);
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log(`Fetching posts${topic ? ` for topic: ${topic}` : ''}`);
        
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
          
          console.log(`Fetched ${data?.length || 0} posts`);
          setPosts(data || []);
        } else {
          // First check if subreddit exists
          const { data: subredditData, error: subredditError } = await supabase
            .from('subreddits')
            .select('id')
            .eq('topic', topic)
            .maybeSingle();
            
          if (subredditError) {
            // Don't throw here, just log and create an empty post list
            console.warn(`Subreddit not found for topic: ${topic}`, subredditError);
            setPosts([]);
            return;
          }
          
          if (!subredditData) {
            console.log(`No posts found for topic: ${topic} (subreddit doesn't exist)`);
            setPosts([]);
            return;
          }
          
          // Fetch posts for this subreddit
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
          
          console.log(`Fetched ${data?.length || 0} posts for topic: ${topic}`);
          setPosts(data || []);
        }
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        
        // Provide user-friendly error message
        const errorMessage = err?.message || "Failed to fetch posts";
        setError(errorMessage);
        
        // Handle specific Supabase errors
        if (err?.code === 'PGRST301' || err?.code === '406') {
          setError("Database connection issue. Please check your Supabase configuration.");
        } 
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [topic, retryCount]);

  // Add retry functionality
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  if (loading) return <div className="flex w-full items-center justify-center p-10 text-xl">Loading...</div>;
  
  if (error) return (
    <div className="flex flex-col w-full items-center justify-center p-10">
      <p className="text-xl text-red-500 mb-4">Error: {error}</p>
      <button 
        onClick={handleRetry}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
      >
        Retry
      </button>
    </div>
  );
  
  if (posts.length === 0) {
    return (
      <div className="flex w-full items-center justify-center p-10 text-xl">
        {topic ? `No posts found in r/${topic}` : 'No posts found'}
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      {posts.map((post, index) => (
        <Post key={post.id || index} post={post} />
      ))}
    </div>
  );
};

export default Feed;