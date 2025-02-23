"use client";
import { motion } from "framer-motion";

export const BackgroundWave = () => {
  return (
    <motion.video
      src="/wave-loop.mp4"
      autoPlay
      muted
      loop
      controls={false}
      className="fixed object-cover bottom-0 z-[-1] hidden md:block pointer-events-none opacity-75 [filter:sepia(100%)_hue-rotate(340deg)_saturate(150%)]"
    />
  );
};
