"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

interface AuthFormProps {
  typeOfAuth: "signup" | "signin";
}

export function AuthForm({ typeOfAuth }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const remember = formData.get("remember");

    try {
      if (typeOfAuth === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (data?.user) {
          await supabase.from("users").update({ name }).eq("id", data.user.id);
        }

        console.log("data:", data);

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        // if (data.user) {
        //   router.push("/dashboard");
        // }

        if (remember) {
          localStorage.setItem("user", JSON.stringify(data.user?.user_metadata));
        } else {
          sessionStorage.setItem("user", JSON.stringify(data.user?.user_metadata));
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Internal server error");
      console.error("Sign-in error: ", error);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      {typeOfAuth === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="email">Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="name" type="text" name="name" placeholder="Enter your name" className="pl-10" required />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="email" type="email" name="email" placeholder="Enter your email" className="pl-10" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </Label>
        </div>
        {/* <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
          Forgot password?
        </Link> */}
      </div>

      {error && <p className="text-red-500 font-bold">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full h-12 text-base font-medium">
        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Sign up"}
      </Button>
    </form>
  );
}
