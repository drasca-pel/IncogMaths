import { useEffect } from "react";

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0B0F14]">
      <img
        src="/incog-logo.png"
        alt="IncogMaths"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      />
    </div>
  );
}