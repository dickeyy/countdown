"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // set exam date to be may 7 at 7:30 am mst
  const examDate: any = new Date("2024-05-07T07:30:00-07:00");
  const [timeTill, setTimeTill] = useState(["00", "00", "00", "00"]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now: any = new Date();
      const diff = examDate - now;
      // set all the times if its > 10 add the 0 in front
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
      console.log(days, hours, minutes, seconds);
      setTimeTill([days, hours, minutes, seconds]);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <main className="bg-black flex min-h-screen flex-col items-center justify-center sm:p-24 p-4">
      <p className="text-lg text-white/40 mb-4">Time until exam:</p>
      <p className="text-3xl sm:text-6xl text-white font-mono font-normal">
        {timeTill[0]}:{timeTill[1]}:{timeTill[2]}:{timeTill[3]}
      </p>
    </main>
  );
}
