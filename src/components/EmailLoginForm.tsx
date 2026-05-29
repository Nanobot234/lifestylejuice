
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const readFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

const getFirstError = (result: z.SafeParseError<unknown>) =>
  result.error.issues[0]?.message || "Please check your email and password.";

const EmailLoginForm = () => {
  const { loginWithEmail, signupWithEmail, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: readFormValue(formData, "email"),
      password: readFormValue(formData, "password"),
    });

    if (!parsed.success) {
      setError(getFirstError(parsed));
      return;
    }

    const success = await loginWithEmail(parsed.data.email, parsed.data.password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const parsed = signupSchema.safeParse({
      email: readFormValue(formData, "email"),
      password: readFormValue(formData, "password"),
      confirmPassword: readFormValue(formData, "confirmPassword"),
    });

    if (!parsed.success) {
      setError(getFirstError(parsed));
      return;
    }

    const success = await signupWithEmail(parsed.data.email, parsed.data.password);
    if (!success) {
      setError("Failed to create account. This email might already be in use.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {mode === "login" ? (
        <>
          <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            
            {error && (
              <Alert variant="destructive" className="bg-destructive/15 border-0">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="login-email">Email</label>
              <Input
                id="login-email"
                name="email"
                placeholder="your.email@example.com"
                type="email"
                inputMode="email"
                autoComplete="email"
                disabled={isLoading}
                onInput={() => setError(null)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="login-password">Password</label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  onInput={() => setError(null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-juicy-green hover:bg-juicy-green/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={toggleMode}>
                Sign up
              </Button>
            </p>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSignupSubmit} className="space-y-4" noValidate>
            <h2 className="text-2xl font-bold text-center">Create Account</h2>
            
            {error && (
              <Alert variant="destructive" className="bg-destructive/15 border-0">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="signup-email">Email</label>
              <Input
                id="signup-email"
                name="email"
                placeholder="your.email@example.com"
                type="email"
                inputMode="email"
                autoComplete="email"
                disabled={isLoading}
                onInput={() => setError(null)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="signup-password">Password</label>
              <div className="relative">
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  onInput={() => setError(null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="relative">
                <Input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  onInput={() => setError(null)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-juicy-green hover:bg-juicy-green/90" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={toggleMode}>
                Login
              </Button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailLoginForm;
