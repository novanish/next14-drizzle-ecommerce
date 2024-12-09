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
import { forgotPassword } from "@/server/actions/forgot-password";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/types/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { AuthCard } from "./auth-card";

export function ForgotPasswordForm() {
  const { toast } = useToast();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, isPending } = useAction(forgotPassword, {
    onSuccess: ({ data }) => {
      toast({
        description: data?.message ?? "Please check your email",
      });
    },
  });

  function onSubmit(data: ForgotPasswordSchema) {
    execute(data);
    form.reset();
  }

  return (
    <AuthCard cardTitle="Enter your email to reset your password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

          <Button
            type="submit"
            className={cn("mt-7 w-full", isPending ? "animate-pulse" : "")}
            disabled={isPending}
          >
            Send Reset Link
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
