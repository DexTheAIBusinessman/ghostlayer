"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ClientMessageFlashProps = {
  type: "success" | "error";
  message: string;
  clearUrl?: string;
};

export default function ClientMessageFlash({
  type,
  message,
  clearUrl = "/client/messages",
}: ClientMessageFlashProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 3500);

    const urlTimer = window.setTimeout(() => {
      router.replace(clearUrl);
    }, 3900);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(urlTimer);
    };
  }, [router, clearUrl]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={
        type === "success"
          ? "mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100 transition"
          : "mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100 transition"
      }
    >
      {message}
    </div>
  );
}
