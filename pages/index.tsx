import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Postbox from "@/components/Postbox";
import Feed from "@/components/Feed";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="my-7 mx-auto lg:max-w-5xl">
      <Head>
        <title>Reddit 2.0</title>
        <meta name="description" content="Reddit 2.0 clone" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header /> */}
      <Postbox />

      <div className="flex">
        <Feed />
      </div>
    </div>
  );
}
