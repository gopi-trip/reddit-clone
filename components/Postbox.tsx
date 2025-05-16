import client from "@/apollo-client";
import { ADD_POST, ADD_SUBREDDIT } from "@/graphql/mutation";
import { GET_POSTS, GET_SUBREDDIT_BY_TOPIC } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
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
  const { data: session } = useSession();

  const [createSubreddit] = useMutation(ADD_SUBREDDIT);
  const [createPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_POSTS, "postList"],
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Formdata>();

  const onFormSubmit = handleSubmit(async (formData) => {
    // Check if user is logged in
    if (!session) {
      toast.error("You need to be logged in to post!");
      return;
    }

    const notification = toast.loading("Creating new Post!");

    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit,
        },
      });
      const SubredditExists = getSubredditListByTopic.length > 0;

      if (SubredditExists) {
        // create the post
        const {
          data: { insertPost: newPost },
        } = await createPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: formData.postImage || "",
            subreddit_id: getSubredditListByTopic[0].id,
            username: session.user?.name || "anonymous",
          },
        });
        console.log("New Post created --> ", newPost);
      } else {
        // create the subreddit and then post
        const {
          data: { insertSubreddit: newSubreddit },
        } = await createSubreddit({
          variables: {
            topic: subreddit || formData.subreddit,
          },
        });

        console.log("Subreddit created, now creating post --> " + formData);

        const {
          data: { insertPost: newPost },
        } = await createPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            image: formData.postImage || "",
            subreddit_id: newSubreddit.id,
            username: session.user?.name || "anonymous",
          },
        });

        console.log("New Post created --> ", newPost);
      }

      // clearing the fields after the post has been added
      setValue("postBody", "");
      setValue("postImage", "");
      setValue("postTitle", "");
      setValue("subreddit", "");
      setImageDialogueOpen(false);

      toast.success("New post created!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Sorry, something went wrong. Please try again!", {
        id: notification,
      });
      console.log(error);
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
          disabled={!session}
          type={`text`}
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
          className={`h-6 cursor-pointer text-gray-300 ${
            imageDialogueOpen && "text-blue-300"
          }`}
          onClick={() => {
            setImageDialogueOpen(!imageDialogueOpen);
          }}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>

      {!!watch("postTitle") && (
        <div>
          {/* body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              type={`text`}
              placeholder="Text (optional)"
              {...register("postBody")}
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
            />
          </div>
          {/* subreddit */}

          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                type={`text`}
                placeholder="ie reactjs"
                {...register("subreddit", { required: true })}
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}
          {/* image */}
          {imageDialogueOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                type={`text`}
                placeholder="Optional"
                {...register("postImage")}
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
              {errors.subreddit?.type === "required" && (
                <p>- Subreddit is required for the post!</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button
              className="w-full rounded-full bg-blue-400 text-white p-2"
              type="submit"
            >
              Create post
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default Postbox;