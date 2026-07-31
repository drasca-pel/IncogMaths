import { useEffect } from "react";

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className="
        fixed
        inset-0
        w-full
        min-h-[100dvh]
        bg-[#0B0F14]
        text-white
        flex
        flex-col
        items-center
        justify-center
        overflow-hidden
      "
    >
      <img
        src="/incog-logo.png"
        alt="IncogMaths"
        className="
          w-40
          h-40
          sm:w-48
          sm:h-48
          md:w-56
          md:h-56
          object-contain
        "
      />

      <h1
        className="
          mt-6
          text-3xl
          sm:text-4xl
          md:text-5xl
          font-bold
        "
      >
        IncogMaths
      </h1>

      <p
        className="
          mt-2
          text-gray-400
          text-sm
          sm:text-base
          md:text-lg
        "
      >
        AI Mathematics Engine
      </p>
    </div>
  );
}