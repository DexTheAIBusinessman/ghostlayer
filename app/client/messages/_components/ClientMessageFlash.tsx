"use client";

import { useEffect, useState } from "react";

export default function ClientMessageFlash() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const sent = url.searchParams.get("sent");
    const error = url.searchParams.get("error");

    if (sent === "1") {
      setMessage("Message sent successfully.");
      url.searchParams.delete("sent");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }

    if (error === "missing") {
      setMessage("Please enter a message before sending.");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!message) {
    return null;
  }

  const isError = message.toLowerCase().includes("please");

  return (
    <div
      className={
        isError
          ? "mb-6 rounded-2xl border border-red-300/25 bg-red-300/10 p-5 text-red-100"
          : "mb-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100"
      }
    >
      {message}
    </div>
  );
}
