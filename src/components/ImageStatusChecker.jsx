import { useEffect, useState, useRef } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineLoop } from "react-icons/md";
import { gsap } from "gsap";
import '../styles/global.css'

export default function ImageStatusChecker() {
  const [status, setStatus] = useState("loading"); // "loading", "ready", "error"
  const statusRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const checkServer = async () => {
      try {
        const res = await fetch("http://localhost:5678/ping", {
          signal: controller.signal,
          cache: "no-cache",
        });

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        if (data?.status === "ok") {
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    checkServer();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      gsap.fromTo(
        statusRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [status]);

  return (
    <div className="mt-6 text-sm" ref={statusRef}>
      {status === "loading" && (
        <span className="flex items-center gap-2 text-blue-500 animate-pulse">
          <MdOutlineLoop className="animate-spin text-lg" />
          Checking image server...
        </span>
      )}

      {status === "ready" && (
        <span className="flex items-center gap-2 text-green-500 font-medium">
          <FaCheckCircle className="text-lg" />
          Local image server is <strong>online</strong>
        </span>
      )}

      {status === "error" && (
        <span className="flex items-center gap-2 text-red-500 font-medium">
          <FaExclamationCircle className="text-lg" />
          Local image server is <strong>offline</strong> or not found
        </span>
      )}
    </div>
  );
}