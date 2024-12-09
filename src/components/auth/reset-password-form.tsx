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
import { resetPassword } from "@/server/actions/reset-password";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/types/reset-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";

export function ResetPasswordForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
  });

  const { execute, isPending } = useAction(resetPassword, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        return toast({
          variant: "destructive",
          description: data.error,
        });
      }

      toast({
        description: "Password reset successfully",
      });

      form.reset();
      router.replace("/auth/login");
    },
  });

  async function onSubmit(data: ResetPasswordSchema) {
    const token = searchParams.get("token");
    if (!token)
      return toast({
        variant: "destructive",
        description: "Token is missing",
      });

    execute({ ...data, token });
  }

  return (
    <AuthCard cardTitle="Reset Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-7">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mt-7">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={cn("mt-7 w-full", isPending ? "animate-pulse" : "")}
            disabled={isPending}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
