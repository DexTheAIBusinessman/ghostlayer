export default function ClientPortalNightSky() {
  const stars = [
    ["6%", "10%", "2px", "0s"],
    ["12%", "32%", "2px", "1.1s"],
    ["25%", "18%", "3px", "1.6s"],
    ["42%", "12%", "2px", "2.5s"],
    ["51%", "38%", "2px", "1.3s"],
    ["68%", "20%", "2px", "2.9s"],
    ["77%", "50%", "3px", "1.8s"],
    ["86%", "16%", "2px", "0.4s"],
    ["94%", "70%", "2px", "2.2s"],
    ["30%", "88%", "2px", "2.4s"],
    ["59%", "74%", "2px", "1.7s"],
    ["90%", "40%", "2px", "0.9s"],
    ["18%", "74%", "3px", "2.8s"],
    ["73%", "82%", "2px", "1.4s"],
  ];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-[#05070b]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.07),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.06),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.04),transparent_42%)]" />

      {stars.map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[clientPortalTwinkle_5.5s_ease-in-out_infinite]"
          style={{
            left,
            top,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        />
      ))}

      <style>{`
        .clientPortalLogoGlow {
          animation: clientPortalLogoGlow 2.8s ease-in-out infinite;
          color: #ffffff;
          text-shadow:
            0 0 8px rgba(255, 255, 255, 0.70),
            0 0 18px rgba(255, 255, 255, 0.45),
            0 0 34px rgba(96, 165, 250, 0.36),
            0 0 52px rgba(59, 130, 246, 0.24);
        }

        @keyframes clientPortalLogoGlow {
          0%, 100% {
            opacity: 0.82;
            text-shadow:
              0 0 7px rgba(255, 255, 255, 0.46),
              0 0 16px rgba(96, 165, 250, 0.24),
              0 0 34px rgba(59, 130, 246, 0.16);
          }

          50% {
            opacity: 1;
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.95),
              0 0 26px rgba(255, 255, 255, 0.58),
              0 0 48px rgba(147, 197, 253, 0.42),
              0 0 76px rgba(59, 130, 246, 0.30);
          }
        }

        @keyframes clientPortalTwinkle {
          0%, 100% {
            transform: translateY(0px) scale(0.75);
            opacity: 0.18;
          }

          50% {
            transform: translateY(-4px) scale(1.18);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
