import Image from "next/image";
import React from "react";
import {
  BeakerIcon,
  BellIcon,
  ChartPieIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  PlusIcon,
  SparklesIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="sticky top-0 z-50 flex bg-white items-center px-4 py-2 shadow-sm">
      {/* logo of reddit */}
      <Link
        href={`/`}
        className="relative flex gap-1 flex-shrink-0 cursor-pointer"
      >
        <Image
  alt="reddit logo"
  src={`https://imgs.search.brave.com/mbonb_vlURUFhHAburC1eb5XVz7fClX3RU7BZd3qU-I/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE4/LzAyL3JlZGRpdC1s/b2dvLTE2LnBuZw`}
  className="object-contain"
  width={20}
  height={10}
/>
        <p>reddit</p>
      </Link>
      <div className="flex items-center mx-7 xl:min-w-[300px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>

        <p className="ml-2 hidden flex-1 lg:inline ">Home</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      <form className="flex flex-1 items-center space-x-2 rounded-sm px-3 py-1 bg-gray-100 border border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>

        <input
          type="text"
          className="outline-none flex-1 bg-transparent"
          placeholder="Search Reddit"
        />
        <button type="submit" hidden />
      </form>

      <div className="mx-5 hidden items-center space-x-2 text-gray-500 lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeAltIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChartPieIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon"
        >
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="icon"
        >
          <path
            fillRule="evenodd"
            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* Sign in and Sign out button */}
      {session ? (
        <div className="hidden lg:flex lg:items-center space-x-2 border border-gray-100 p-2">
          <div className="relative h-5 w-5 flex-shrink-0">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                fill
                alt="user's profile picture on reddit"
                className="object-contain"
              />
            ) : (
              <Image
                src={`https://links.papareact.com/23l`}
                fill
                alt="reddit mascot"
                className="object-contain"
              />
            )}
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session.user?.name}</p>
            <p className="text-gray-400">1 Karma</p>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              signOut();
            }}
          >
            <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            return signIn();
          }}
          className="hidden lg:flex lg:items-center space-x-2 border border-gray-100 p-2 cursor-pointer"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              src={`https://links.papareact.com/23l`}
              fill
              alt="reddit mascot"
              className="object-contain"
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
};

export default Header;
