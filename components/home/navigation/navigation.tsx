"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setUser(user);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            {user && user.name ? (
              <Link href="/dashboard">
                <CircleUserRound />
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
