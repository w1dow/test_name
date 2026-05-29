import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function IntroScreen() {
  const setHasSeenIntro = useAppStore((s) => s.setHasSeenIntro);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2500);
    const t3 = setTimeout(() => {
      setVisible(false);
      setHasSeenIntro(true);
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [setHasSeenIntro]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "radial-gradient(ellipse at center, #0a0a1a 0%, #050508 100%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Animated particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cyan-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Swirling ring effect */}
          <motion.div
            className="absolute w-64 h-64 rounded-full border-2 border-cyan-500/20"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute w-56 h-56 rounded-full border border-purple-500/20"
            animate={{
              rotate: [360, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              rotate: { duration: 12, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Logo content */}
          <div className="relative flex flex-col items-center">
            {/* Logo image */}
            <motion.img
              src="/logo_lumis.png"
              alt="LUMIS"
              className="w-64 h-64 object-contain"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                scale: phase >= 1 ? 1 : 0.5,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Text animation */}
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                y: phase >= 2 ? 0 : 20,
              }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-5xl font-bold tracking-wider"
                style={{
                  color: "#FFFFFF",
                  textShadow: "0px 0px 20px rgba(0, 240, 255, 0.5)",
                  fontFamily: "'Brush Script MT', cursive",
                }}
              >
                LUMIS
              </h1>
              <p
                className="mt-3 text-sm tracking-[0.3em] uppercase"
                style={{ color: "#8A8D99" }}
              >
                Your AI Academic Partner
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
