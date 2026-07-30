import { useEffect } from "react";

export default function Splash({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-white">

      <img
        src="/incog-logo.png"
        alt="IncogMaths"
        className="w-40 h-40 object-contain"
      />

      <h1 className="mt-6 text-3xl font-bold">
        IncogMaths
      </h1>

      <p className="mt-2 text-gray-400">
        AI Mathematics Engine
      </p>

    </div>
  );
}