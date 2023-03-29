import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type Pageprops = {
  seed?: string;
  large?: boolean;
};

const Avatar = ({ seed, large }: Pageprops) => {
  const { data: session } = useSession();
  return (
    <div
      className={`h-10 w-10 relative overflow-hidden rounded-full border border-gray-300 bg-white ${
        large && "h-20 w-20"
      }`}
    >
      <Image
        fill
        alt="User avatar"
        src={`https://avatars.dicebear.com/api/open-peeps/${
          seed || session?.user?.name || "placeholder"
        }.svg`}
      />
    </div>
  );
};

export default Avatar;
