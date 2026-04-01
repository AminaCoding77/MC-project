"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";

type UserType = {
  firstname: string;
  lastname: string;
  profilePicture: string | null;
  email: string;
};

const Page = () => {
  const [selected, setSelected] = useState<Date | null>(null);
  const [user, SetUser] = useState<UserType | null>(null);
  const { push } = useRouter();

  useEffect(() => {
    if (user === null) {
      push("./frontpage");
    }
  }, []);

  const handleDateClick = (date: Date) => {
    setSelected(date);
  };
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">My School Calendar</h1>
      <div className="w-full max-w-5xl">
        <Calendar
          onClickDay={handleDateClick}
          value={selected}
          className="bg-white rounded-xl shadow-lg p-4 text-gray-700"
        />
      </div>
      <div className="mt-6 text-lg text-gray-600">
        Selected Date: {selected?.toDateString()}
      </div>
    </div>
  );
};

export default Page;
