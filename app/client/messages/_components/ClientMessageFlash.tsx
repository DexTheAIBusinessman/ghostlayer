"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ClientMessageFlashProps = {
  type: "success" | "error";
  message: string;
};

export default function ClientMessageFlash({
  type,
  message,
}: ClientMessageFlashProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    const cleanUrlTimer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("sent");

      const query = params.toString();
      router.replace(query ? `/client/messages?${query}` : "/client/messages", {
        scroll: false,
      });
    }, 3200);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(cleanUrlTimer);
    };
  }, [router, searchParams]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={
        type === "success"
          ? "mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100"
          : "mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100"
      }
    >
      {message}
    </div>
  );
}
