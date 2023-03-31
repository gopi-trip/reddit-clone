import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import Avatar from "./Avatar";
import TimeAgo from "react-timeago";
import Link from "next/link";

type props = {
  post: Post;
};

const Post = ({ post }: props) => {
  return (
    <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600">
      {/* votes */}
      <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400">
        <ArrowUpIcon className="voteButtons hover:text-red-400" />
        <p className="text-xs font-bold text-black">0</p>
        <ArrowDownIcon className="voteButtons hover:text-blue-400" />
      </div>

      <div className="p-3 pb-1">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Avatar seed={post.subreddit[0]?.topic} />
          <Link
            href={`/subreddit/${post.subreddit[0]?.topic}`}
            className="text-xs text-gray-400"
          >
            <span className="font-bold text-black hover:text-blue-400 hover:underline">
              r/{post.subreddit[0]?.topic}
            </span>{" "}
            . Posted by u/
            {post.username} <TimeAgo date={post.created_at} />
          </Link>
        </div>
        {/* Body */}
        <div className="py-4">
          <h2 className="textxl font-semibold">{post.title}</h2>
          <p className="mt-2 text-sm font-light">{post.body}</p>
        </div>
        {/* Image */}
        {post.image.length !== 0 && (
          <img src={post.image} className="w-full" alt="reddit post's image" />
        )}
        {/* Footer */}
        <div className="flex space-x-4 text-gray-400">
          <div className="postButtons">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <p className="">{post.comments.length} Comments</p>
          </div>
          <div className="postButtons">
            <GiftIcon className="h-6 w-6" />
            <p className="hidden sm:inline">Award</p>
          </div>
          <div className="postButtons">
            <ShareIcon className="h-6 w-6" />
            <p className="hidden sm:inline">Share</p>
          </div>
          <div className="postButtons">
            <BookmarkIcon className="h-6 w-6" />
            <p className="hidden sm:inline">Save</p>
          </div>
          <div className="postButtons">
            <ChatBubbleLeftIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
