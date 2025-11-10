"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
const Loader = () => {
  const path = usePathname();

  const [loading, setLoading] = useState<boolean>(false);
  const [prevPath, setPrevPath] = useState(path);
  useEffect(() => {
    if (path !== prevPath) {
      setLoading(true);
      const timer = setTimeout(() => {
        setPrevPath(path);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [prevPath, path]);
  if (!loading) return null;
  console.log(path, prevPath);
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
