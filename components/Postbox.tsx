import { LinkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "./Avatar";

type Formdata = {
  postTitle: string;
  postImage: string;
  postBody: string;
  subreddit: string;
};

const Postbox = () => {
  const [imageDialogueOpen, setImageDialogueOpen] = useState<boolean>(false);
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Formdata>();

  const onFormSubmit = handleSubmit(async (formData) => {
    console.log(formData);
  });

  const { data: session } = useSession();
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
              ? "Create a post by entering the title"
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

          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Subreddit:</p>
            <input
              type={`text`}
              placeholder="ie reactjs"
              {...register("subreddit", { required: true })}
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
            />
          </div>
          {/* image */}
          {imageDialogueOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                type={`text`}
                placeholder="Optional"
                {...register("subreddit")}
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
