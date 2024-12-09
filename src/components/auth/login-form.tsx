"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { emailSignIn } from "@/server/actions/email-signin";
import { LoginSchema, loginSchema } from "@/types/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { AuthCard } from "./auth-card";

export function LoginForm() {
  const { toast } = useToast();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { execute, isPending } = useAction(emailSignIn, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        return toast({
          variant: "destructive",
          description: data.error,
        });
      }

      if (data?.showTwoFactor) {
        setShowTwoFactor(true);
      }
    },
  });

  function onSubmit(data: LoginSchema) {
    if (showTwoFactor && (!data.code || data.code.length !== 6)) {
      form.setError("code", {
        type: "manual",
        message: "Please enter the code",
      });
      return;
    }

    execute(data);
  }

  return (
    <AuthCard
      cardTitle={showTwoFactor ? "Two Factor Authentication" : "Login"}
      {...(showTwoFactor
        ? {
            showSocialLogin: false,
          }
        : {
            showSocialLogin: true,
            backButtonHref: "/auth/register",
            backButtonText: "Create an account",
          })}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {showTwoFactor ? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    We&apos;ve sent you a two factor code to your email.
                  </FormLabel>
                  <FormControl className="mt-2">
                    <InputOTP disabled={isPending} {...field} maxLength={6}>
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-7">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="link" size="sm" className="pl-0" asChild>
                <Link href="/auth/forgot-password">Forgot password?</Link>
              </Button>
            </>
          )}
          <Button
            type="submit"
            className={cn("mt-7 w-full", isPending ? "animate-pulse" : "")}
            disabled={isPending}
          >
            {showTwoFactor ? "Verify" : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
