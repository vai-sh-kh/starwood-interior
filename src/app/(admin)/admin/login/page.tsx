"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ADMIN_EMAIL = "vaishakhpat2003@gmail.com";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (emailValue: string): boolean => {
    if (emailValue.trim() === "") {
      setEmailError("Email is required");
      return false;
    }
    if (emailValue.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setEmailError("Access denied. Only authorized administrators can sign in.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side email validation
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      // Server-side email verification
      if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        // Sign out the user if email doesn't match
        await supabase.auth.signOut();
        toast.error("Access denied. Only authorized administrators can sign in.");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.push("/admin");
      router.refresh();
    } catch (error: unknown) {
      let errorMessage = "An error occurred during sign in";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Provide user-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email address before signing in.";
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              placeholder="Enter your email address"
              required
              disabled={isLoading}
              className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-black h-12 ${
                emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isLoading}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-black h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-black text-white hover:bg-gray-800 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
