import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type Pageprops = {
  seed?: string;
  large?: boolean;
};

const Avatar = ({ seed, large }: Pageprops) => {
  const { data: session } = useSession();
  
  // Using updated DiceBear API URL
  const avatarUrl = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${
    seed || session?.user?.name || "placeholder"
  }`;
  
  return (
    <div
      className={`h-10 w-10 relative overflow-hidden rounded-full border border-gray-300 bg-white ${
        large && "h-20 w-20"
      }`}
    >
      <Image
        fill
        alt="User avatar"
        src={avatarUrl}
      />
    </div>
  );
};

export default Avatar;