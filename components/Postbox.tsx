import supabase from "@/lib/supabaseClient";
import { LinkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

type Formdata = {
  postTitle: string;
  postImage: string;
  postBody: string;
  subreddit: string;
};

type props = {
  subreddit?: string;
};

const Postbox = ({ subreddit }: props) => {
  const [imageDialogueOpen, setImageDialogueOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Formdata>();

  const onFormSubmit = handleSubmit(async (formData) => {
    // Prevent double submission
    if (isSubmitting) return;
    
    // Check if user is logged in
    if (!session) {
      toast.error("You need to be logged in to post!");
      return;
    }

    const notification = toast.loading("Creating new Post...");
    setIsSubmitting(true);

    try {
      const topic = subreddit || formData.subreddit;
      
      if (!topic) {
        toast.error("Subreddit is required", { id: notification });
        return;
      }
      
      console.log(`Creating post in subreddit: ${topic}`);
      
      // Check if subreddit exists
      const { data: existingSubreddit, error: subredditError } = await supabase
        .from('subreddits')
        .select('id')
        .eq('topic', topic)
        .maybeSingle();
        
      if (subredditError && subredditError.code !== 'PGRST116') {
        throw subredditError;
      }
      
      let subredditId;
      
      if (!existingSubreddit) {
        console.log(`Creating new subreddit: ${topic}`);
        // Create new subreddit
        const { data: newSubreddit, error: createSubredditError } = await supabase
          .from('subreddits')
          .insert([{ topic }])
          .select()
          .single();
          
        if (createSubredditError) throw createSubredditError;
        
        if (!newSubreddit) {
          throw new Error("Failed to create subreddit");
        }
        
        subredditId = newSubreddit.id;
        console.log("Subreddit created, ID:", subredditId);
      } else {
        subredditId = existingSubreddit.id;
        console.log("Using existing subreddit, ID:", subredditId);
      }
      
      // Create the post
      const postData = {
        title: formData.postTitle,
        body: formData.postBody || "",
        image: formData.postImage || "",
        subreddit_id: subredditId,
        username: session.user?.name || "anonymous",
      };
      
      console.log("Creating post with data:", postData);
      
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();
        
      if (postError) throw postError;
      
      if (!newPost) {
        throw new Error("Failed to create post");
      }
      
      console.log("New Post created -->", newPost);

      // clearing the fields after the post has been added
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("subreddit", "");
      setImageDialogueOpen(false);

      toast.success("New post created!", {
        id: notification,
      });
    } catch (error: any) {
      console.error("Error creating post:", error);
      
      let errorMessage = "Sorry, something went wrong. Please try again!";
      
      // More specific error messages based on the error
      if (error?.code === '23505') {
        errorMessage = "This post already exists!";
      } else if (error?.code === '23502') {
        errorMessage = "Required fields are missing!";
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage, {
        id: notification,
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form
      onSubmit={onFormSubmit}
      className="rounded-md bg-white border border-gray-300 sticky top-16 z-50 p-2"
    >
      <div className="flex space-x-3 items-center">
        <Avatar large={false} />
        <input
          {...register("postTitle", { required: true })}
          disabled={!session || isSubmitting}
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : "Create a post by entering the title"
              : "Sign in to create a post"
          }
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
        />
        <PhotoIcon
          className={`h-6 cursor-pointer ${
            imageDialogueOpen ? "text-blue-300" : "text-gray-300"
          } ${!session && "opacity-50"}`}
          onClick={() => {
            if (session) setImageDialogueOpen(!imageDialogueOpen);
          }}
        />
        <LinkIcon className={`h-6 text-gray-300 ${!session && "opacity-50"}`} />
      </div>

      {!!watch("postTitle") && (
        <div>
          {/* body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              type="text"
              placeholder="Text (optional)"
              {...register("postBody")}
              disabled={isSubmitting}
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
            />
          </div>
          {/* subreddit */}

          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                type="text"
                placeholder="ie reactjs"
                {...register("subreddit", { required: true })}
                disabled={isSubmitting}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}
          {/* image */}
          {imageDialogueOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                type="text"
                placeholder="Optional"
                {...register("postImage")}
                disabled={isSubmitting}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}
          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p>- A post title is required!</p>
              )}
              {errors.subreddit?.type === "required" && !subreddit && (
                <p>- Subreddit is required for the post!</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              className={`w-full rounded-full ${
                isSubmitting ? "bg-gray-300" : "bg-blue-400 hover:bg-blue-500"
              } text-white p-2`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating post..." : "Create post"}
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default Postbox;