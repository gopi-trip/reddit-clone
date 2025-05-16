import Avatar from "@/components/Avatar";
import Post from "@/components/Post";
import { ADD_COMMENT } from "@/graphql/mutation";
import { GET_POST_BY_ID } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import TimeAgo from "react-timeago";
import { Post as PostType } from "@/types/Post";

type FormData = {
  comment: string;
};

const PostPage = () => {
  const { data: session } = useSession();

  const [insertComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, "postById"],
  });

  const router = useRouter();
  const { post_id } = router.query;

  const { data, error, loading } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: post_id,
    },
    skip: !post_id, // Skip query if post_id is not available yet
  });

  const post: PostType = data?.postById;

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const formSubmissionHandler: SubmitHandler<FormData> = async (data) => {
    // create a notification for the comment
    const notification = toast.loading("Posting your comment...");

    //now insert comment to database
    try {
      await insertComment({
        variables: {
          post_id: post_id,
          username: session?.user?.name,
          text: data.comment,
        },
      });
      setValue("comment", "");
      toast.success("Comment posted successfully!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Something went wrong, please try again!", {
        id: notification,
      });
      console.log(error, moment().format("DD-MM-YYYY HH:mm:ss"));
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center">Error loading post</div>;

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Head>
        <title>{post?.title || "Reddit Post"}</title>
      </Head>
      <Post post={post} />
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm mb-2">
          comment as <span className="text-red-500">{session?.user?.name}</span>
        </p>
        <form
          onSubmit={handleSubmit(formSubmissionHandler)}
          className="flex flex-col space-y-2"
        >
          <textarea
            disabled={!session}
            {...register("comment", { required: true })}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? "What are your thoughts?" : "Please sign in to comment"
            }
          />
          <button
            disabled={!session}
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>
      {post?.comments && post.comments.length > 0 && (
        <div className="-my-5 rounded-b-md border border-gray-300 border-t-0 bg-white py-5 px-10">
          <hr className="py-2" />
          {post.comments.map((comment, index) => (
            <div
              className="relative flex items-center space-x-2 space-y-5"
              key={index}
            >
              <hr className="absolute top-10 left-7 z-0 h-16 border" />
              <div className="z-50">
                <Avatar seed={comment.username} />
              </div>
              <div className="flex flex-col">
                <p className="py-2 text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">
                    {comment.username}
                  </span>{" "}
                  . <TimeAgo date={comment.created_at} />
                </p>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPage;