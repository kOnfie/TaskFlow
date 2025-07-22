import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { GoogleForm } from "@/components/auth/google-form";

interface AuthPageProps {
  typeOfAuth: "signup" | "signin";
}

export default function AuthPage({ typeOfAuth }: AuthPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {typeOfAuth === "signup" ? "Hello! Glad to see you!" : "Hello! Welcome back!"}
          </h2>
          <p className="text-gray-600 mt-2">
            {typeOfAuth === "signup" ? "Sign up to TaskFlow" : "Sign in to TaskFlow"}
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{typeOfAuth === "signup" ? "Sign up" : "Sign in"}</CardTitle>
            {/* <CardDescription className="text-center">Choose your preferred sign in method</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <GoogleForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div> */}

            <AuthForm typeOfAuth={typeOfAuth} />

            {typeOfAuth === "signup" ? (
              <div className="text-center text-sm text-gray-600">
                Do you have an account?{" "}
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
