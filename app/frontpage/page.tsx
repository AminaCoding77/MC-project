"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-300 to-indigo-400 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Welcome to Student Time Management System
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-xl">
          Keep track of your exams, study time, and daily commitments. Manage
          your schedule smartly and make the most of your exam preparation.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              push("/login");
            }}
            variant="secondary"
            className="text-[20px] px-4 py-2 bg-blue-500 shadow-2xl"
          >
            Sign in
          </Button>
          <Button
            onClick={() => {
              push("/sign-up");
            }}
            variant="secondary"
            className="text-[20px] px-4 py-2 bg-blue-500"
          >
            Sign up
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Page;
