"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { apiUrl } from "../apiurl";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm();
  const router = useRouter();
  async function onSubmit(data: any) {
    setIsLoading(true);
    const route = type === "login" ? "/api/auth/signin" : "/api/auth/signup";
    try {
      const body =
        type === "login"
          ? { email: data.email, password: data.password }
          : {
              username: data.username,
              email: data.email,
              password: data.password,
            };
      const response = await apiUrl.post(route, body, {withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }});
      if (response.headers["authorization"]) {
        apiUrl.defaults.headers.common["authorization"] =
          response.headers["authorization"];
        sessionStorage.setItem(
          "authorization",
          response.headers["authorization"]
        );
      } else if (sessionStorage.getItem("authorization")) {
        apiUrl.defaults.headers.common["authorization"] =
          sessionStorage.getItem("authorization");
      }
      if (response.data.authenticated) {
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("userName", response.data.userName);
        // router.push(`/draw`);
        // window.location.href = "/draw";
        window.location.assign("https://nitrate-dss-tool-lo1r.onrender.com/draw");
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {type == "signup" && (
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="username"
                type="text"
                autoCapitalize="none"
                autoComplete="none"
                autoCorrect="off"
                disabled={isLoading}
                required
                {...form.register("username")}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              {...form.register("email")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
              {...form.register("password")}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {type === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
